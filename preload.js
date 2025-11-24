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
    return () => ipcRenderer.removeListener("auth-success", callback);
  },

  // creer fichier
  createOrUpdateBook: (fileName, content) =>
    ipcRenderer.invoke("create-or-update-book", { fileName, content }),
  // effacer fichier
  eraseMarkdown: (book) => ipcRenderer.invoke("erase-markdown", book),
  ///Python child process
  runPythonSTT: (config) => ipcRenderer.invoke("run-python-stt", config),
  onPythonOutput: (callback) =>
    ipcRenderer.on("python-output", (_, data) => callback(data)),
  onPythonError: (callback) =>
    ipcRenderer.on("python-error", (_, data) => callback(data)),
  onPythonExit: (callback) =>
    ipcRenderer.on("python-exit", (_, code) => callback(code)),
  showOpenDialog: () => ipcRenderer.invoke("open-dialog"),
  selectTranscriptionFile: () => ipcRenderer.invoke("select-transcription"),
  readFile: (path) => ipcRenderer.invoke("read-file", path),
});
