// main.js
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Convertir __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Check if we're in development
  const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // Load from Vite dev server
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    // Load from built files
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }
}


app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
