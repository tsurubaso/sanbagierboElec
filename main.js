import "dotenv/config";
import { app, BrowserWindow, ipcMain, shell } from "electron"; //
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Store from "electron-store";
import { scanBooksFolder } from "./api/bookScanner.js";
import simpleGit from "simple-git";

const store = new Store();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  DÉCLARER mainWindow EN GLOBAL
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "public", "image4.jpg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  console.log("BrowserWindow created");
  const isDev = process.argv.includes("--dev");

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools(); // débugger
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

//  SCANNER LES LIVRES AU DÉMARRAGE
async function scanAndStoreBooks() {
  const booksPath = path.join(__dirname, "public", "books");
  console.log("📚 Scanning books folder:", booksPath);

  const books = await scanBooksFolder(booksPath);

  console.log(`✅ Found ${books.length} books`);

  // Stocker dans electron-store
  store.set("books", books);
  store.set("books_last_scan", new Date().toISOString());

  return books;
}

//  IPC HANDLER : Récupérer les livres depuis le store
ipcMain.handle("read-books-json", async () => {
  try {
    const books = store.get("books", []);

    // Si vide, rescanner
    if (books.length === 0) {
      return await scanAndStoreBooks();
    }

    return books;
  } catch (error) {
    console.error("Erreur lors de la lecture des livres:", error);
    throw error;
  }
});

//  IPC HANDLER : Forcer un rescan
ipcMain.handle("rescan-books", async () => {
  return await scanAndStoreBooks();
});

// IPC pour lire un fichier Markdown
ipcMain.handle("read-markdown", async (event, link) => {
  try {
    const filePath = path.join(__dirname, "public", "books", `${link}.md`);
    const content = fs.readFileSync(filePath, "utf8");
    return content.replace(/^---[\s\S]+?---\s*/, ""); // strip frontmatter
  } catch (err) {
    console.error("Erreur lecture Markdown:", err);
    throw err;
  }
});

// IPC pour lire un fichier Markdown
ipcMain.handle("read-markdown-editing", async (event, link) => {
  try {
    const filePath = path.join(__dirname, "public", "books", `${link}.md`);
    const content = fs.readFileSync(filePath, "utf8");
    return content; // NO strip frontmatter
  } catch (err) {
    console.error("Erreur lecture Markdown:", err);
    throw err;
  }
});

ipcMain.handle("write-markdown", async (event, args) => {
  try {
    const filePath = path.join(
      __dirname,
      "public",
      "books",
      `${args.filePath}.md`
    );

    await fs.promises.writeFile(filePath, args.content, "utf8");

    return true;
  } catch (err) {
    console.error("Erreur écriture Markdown:", err);
    throw err;
  }
});

// =======================================================
// GITHUB DEVICE FLOW / SESSION
// =======================================================

// Lance login GitHub
ipcMain.handle("github-login", async () => {
  const client_id = process.env.GITHUB_CLIENT_ID;

  try {
    // 1. Demander un device code
    const params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("scope", "read:user repo");

    const deviceResponse = await fetch("https://github.com/login/device/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params,
    });

    const deviceData = await deviceResponse.json();

    if (!deviceData.user_code) {
      throw new Error("Invalid device response: " + JSON.stringify(deviceData));
    }

    // Ouvrir le navigateur
    await shell.openExternal(deviceData.verification_uri);

    // 3. Retourner le code à afficher à l'utilisateur
    return {
      user_code: deviceData.user_code,
      device_code: deviceData.device_code,
      interval: deviceData.interval,
    };
  } catch (err) {
    console.error("Device flow error:", err);
    throw err;
  }
});

// ✅ Polling pour vérifier si l'utilisateur a validé
ipcMain.handle("github-poll-token", async (event, deviceCode) => {
  const client_id = process.env.GITHUB_CLIENT_ID;

  try {
    const params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("device_code", deviceCode);
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:device_code");

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: params,
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      store.set("github_token", tokenData.access_token);
      return { success: true, token: tokenData.access_token };
    }

    // Encore en attente
    return { success: false, error: tokenData.error };
  } catch (err) {
    console.error("Token poll error:", err);
    return { success: false, error: err.message };
  }
});

// Récupère la session si présente
ipcMain.handle("github-session", () => {
  return store.get("github_token", null);
});

// Logout
ipcMain.handle("github-logout", () => {
  store.delete("github_token");
  return true;
});

// =======================================================
// GITHUB PROFILE
// =======================================================

ipcMain.handle("github-profile", async () => {
  const token = store.get("github_token");
   if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error("GitHub API error: " + response.status);
    }

    const profile = await response.json();

    return {
      login: profile.login,
      name: profile.name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      html_url: profile.html_url
    };

  } catch (err) {
    console.error("GitHub profile error:", err);
    throw err;
  }
});

// =======================================================
// GIT OPS (pull / push / sync)
// =======================================================

const WORKSPACE = process.cwd(); // dossier réel, pas asar !
const SUBMODULE = path.join(WORKSPACE, "public/books");

const gitParent = simpleGit(WORKSPACE);
const gitSub = simpleGit(SUBMODULE);

// ----------------------
//  PULL
// ----------------------
ipcMain.handle("github-pull", async () => {
  try {
    await gitSub.pull("origin");
    await gitParent.pull("origin");
    return { success: true };
  } catch (err) {
    console.error("Pull error:", err);
    return { success: false, error: err.message };
  }
});

// ----------------------
//  PUSH
// ----------------------
ipcMain.handle("github-push", async () => {
  const token = store.get("github_token");
  if (!token) return { success: false, error: "No token" };

  try {
    await gitSub.add(".");
    await gitSub.commit("Update books from Electron").catch(() => {});
    await gitSub.push(["origin", "master"]); // ou "main" si applicable

    await gitParent.add("public/books");
    await gitParent.commit("Update submodule pointer").catch(() => {});
    await gitParent.push(["origin", "main"]);

    return { success: true };
  } catch (err) {
    console.error("Push error:", err);
    return { success: false, error: err.message };
  }
});

// ----------------------
//  SYNC (pull + push)
// ----------------------
ipcMain.handle("github-sync", async () => {
  try {
    await gitSub.pull("origin");
    await gitParent.pull("origin");

    await gitSub.add(".");
    await gitSub.commit("Sync from Electron").catch(() => {});
    await gitSub.push("origin", "master");

    await gitParent.add("public/books");
    await gitParent.commit("Sync submodule pointer").catch(() => {});
    await gitParent.push("origin", "main");

    return { success: true };
  } catch (err) {
    console.error("Sync error:", err);
    return { success: false, error: err.message };
  }
});

app.whenReady().then(async () => {
  console.log("Electron app ready");

  //  SCANNER AU DÉMARRAGE
  await scanAndStoreBooks();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ✅ Pour macOS - recréer la fenêtre si fermée
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
