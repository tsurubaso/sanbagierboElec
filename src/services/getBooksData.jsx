export async function getBooksData() {
  try {
    const books = await window.electronAPI.readBooksJson();
    return books;
  } catch (error) {
    console.error("Erreur de lecture JSON via Electron:", error);
    return [];
  }
}
