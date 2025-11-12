// preload.js - Change to CommonJS
const { contextBridge ,ipcRenderer} = require("electron");


contextBridge.exposeInMainWorld("electronAPI", {
  // tes fonctions ici
  readBooksJson: () => ipcRenderer.invoke("read-books-json"),
});
