// preload.js - Change to CommonJS
const { contextBridge, ipcRenderer } = require("electron");

console.log("preload loaded"); 

contextBridge.exposeInMainWorld("electronAPI", {
  //  fonctions
  readBooksJson: () => ipcRenderer.invoke("read-books-json"),
  rescanBooks: () => ipcRenderer.invoke("rescan-books"), //
  readMarkdown: (filePath) => ipcRenderer.invoke("read-markdown", filePath),
  readMarkdownEditing: (filePath) =>
    ipcRenderer.invoke("read-markdown-editing", filePath),
  writeMarkdown: (filePath, content) =>
    ipcRenderer.invoke("write-markdown", { filePath, content }),

  //fonctions liées à Gitthub
  githubProfile: () => ipcRenderer.invoke("github-profile"),
  githubLogin: () => ipcRenderer.invoke("github-login"),
  githubPollToken: (deviceCode) =>
    ipcRenderer.invoke("github-poll-token", deviceCode),
  githubSession: () => ipcRenderer.invoke("github-session"),
  githubLogout: () => ipcRenderer.invoke("github-logout"),
  //fonctions de Sync
  githubPull: () => ipcRenderer.invoke("github-pull"),
  githubPush: () => ipcRenderer.invoke("github-push"),
  githubSync: () => ipcRenderer.invoke("github-sync"),
  onAuthSuccess: (callback) => {
    ipcRenderer.on("auth-success", callback);
    return () =>
      ipcRenderer.removeListener("auth-success", callback);
  },

  // ✅ MISSING FUNCTION ADDED
  createOrUpdateBook: (fileName, content) =>
    ipcRenderer.invoke("create-or-update-book", { fileName, content }),
});
