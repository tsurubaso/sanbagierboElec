import { app, BrowserWindow, ipcMain, shell } from "electron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Store from "electron-store";
import axios from "axios";

const store = new Store();
let mainWindow = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
console.log("BrowserWindow created:", mainWindow);
  const isDev = process.argv.includes("--dev");

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
  }
}

app.setAsDefaultProtocolClient("sanbagierboelec");

async function exchangeCodeForToken(code) {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  const res = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id,
      client_secret,
      code,
    },
    { headers: { Accept: "application/json" } }
  );

  if (!res.data.access_token) throw new Error("GitHub returned no token");

  return res.data.access_token;
}


// IPC pour lire le fichier mockup stories.json
ipcMain.handle("read-books-json", async () => {
  const filePath = path.join(__dirname, "public", "stories.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier JSON:", error);
    throw error;
  }
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

// Lance login GitHub
ipcMain.handle("github-login", async () => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const authUrl = `https://github.com/login/oauth/authorize` +
    `?client_id=${client_id}` +
    `&redirect_uri=sanbagierboelec://auth` +
    `&scope=read:user`;

  shell.openExternal(authUrl);
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


app.on("open-url", async (event, url) => {
  event.preventDefault();

  const code = new URL(url).searchParams.get("code");
  if (!code) return;

  try {
    const token = await exchangeCodeForToken(code);

    // sauvegarde localement
    store.set("github_token", token);

    // prévenir le renderer
    if (mainWindow) {
      mainWindow.webContents.send("auth-success", token);
    }
  } catch (err) {
    console.error("OAuth failed:", err);
  }
});

app.whenReady().then(() => {
  console.log("Electron app ready");
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
