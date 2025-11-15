// preload.js - Change to CommonJS
const { contextBridge, ipcRenderer } = require("electron");


console.log("preload loaded");
contextBridge.exposeInMainWorld("electronAPI", {
  
  //  fonctions
  readBooksJson: () => ipcRenderer.invoke("read-books-json"),
  readMarkdown: (filePath) => ipcRenderer.invoke("read-markdown", filePath),
  readMarkdownEditing: (filePath) =>
    ipcRenderer.invoke("read-markdown-editing", filePath),
  writeMarkdown: (filePath, content) =>
    ipcRenderer.invoke("write-markdown", { filePath, content }),
 // githubLogin: () => ipcRenderer.invoke("github-login"),
  //githubSession: () => ipcRenderer.invoke("github-session"),
 // githubLogout: () => ipcRenderer.invoke("github-logout"),
   //retourne une fonction de nettoyage
  //onAuthSuccess: (callback) => {ipcRenderer.on("auth-success", callback);
    // Retourne la fonction pour désinscrire le listener
   // return () => ipcRenderer.removeListener("auth-success", callback);},
});
