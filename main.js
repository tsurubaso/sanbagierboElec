
import 'dotenv/config';
import { app, BrowserWindow, ipcMain, shell  } from "electron";//
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Store from "electron-store";
import { scanBooksFolder } from "./api/bookScanner.js";
import { exchangeCodeForToken } from "./api/github.js";
//console.log("ENV CHECK:", process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET);

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
  console.log("BrowserWindow created:");
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

app.setAsDefaultProtocolClient("sanbagierboelec");

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

// Lance login GitHub
ipcMain.handle("github-login", async () => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const authUrl =
    `https://github.com/login/oauth/authorize` +
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

app.whenReady().then(async() => {
  console.log("Electron app ready");

    // ✅ SCANNER AU DÉMARRAGE
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
