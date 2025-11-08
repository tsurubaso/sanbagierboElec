// preload.js - Change to CommonJS
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // tes fonctions ici
});
