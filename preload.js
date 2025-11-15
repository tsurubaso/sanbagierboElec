// preload.js - Change to CommonJS
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  //  fonctions
  readBooksJson: () => ipcRenderer.invoke("read-books-json"),
  readMarkdown: (filePath) => ipcRenderer.invoke("read-markdown", filePath),
  readMarkdownEditing: (filePath) =>
    ipcRenderer.invoke("read-markdown-editing", filePath),
  writeMarkdown: (filePath, content) =>
    ipcRenderer.invoke("write-markdown", { filePath, content }),
  githubLogin: () => ipcRenderer.invoke("github-login"),
  githubSession: () => ipcRenderer.invoke("github-session"),
  githubLogout: () => ipcRenderer.invoke("github-logout"),
  onAuthSuccess: (cb) => ipcRenderer.on("auth-success", cb),
});
