// main.js
import simpleGit from 'simple-git';
import path from 'path';
import { ipcMain } from 'electron';
import Store from 'electron-store';

const store = new Store();

ipcMain.handle("github-push", async () => {
  const token = store.get("github_token");
  if (!token) {
    throw new Error("No GitHub token available. Please login first.");
  }

  try {
    const git = simpleGit({ baseDir: path.join(__dirname, 'public', 'books') });

    await git.add('.');
    await git.commit('Sync from Electron app');
    await git.push('origin', 'main');

    return { success: true };
  } catch (err) {
    console.error("GitHub push error:", err);
    return { success: false, error: err.message };
  }
});
