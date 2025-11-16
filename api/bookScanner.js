import fs from "fs/promises";
import path from "path";

/**
 * Extrait les métadonnées frontmatter d'un fichier Markdown
 * Format attendu :
 * ---
 * id: AImaronnier
 * title: Mon titre
 * text_author: Tsurubaso
 * ---
 */
export function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      // Convertir "null" string en null
      frontmatter[key.trim()] = value === 'null' ? null : value;
    }
  }
  
  return frontmatter;
}

/**
 * Scanne tous les fichiers .md dans le dossier books
 */
export async function scanBooksFolder(booksPath) {
  try {
    const files = await fs.readdir(booksPath);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const books = [];
    
    for (const file of mdFiles) {
      try {
        const filePath = path.join(booksPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        const metadata = parseFrontmatter(content);
        
        if (metadata) {
          // Ajouter le link basé sur le nom du fichier (sans .md)
          const link = path.basename(file, '.md');
          
          books.push({
            id: metadata.id || link,
            title: metadata.title || 'Sans titre',
            text_author: metadata.text_author || null,
            illu_author: metadata.illu_author || null,
            type: metadata.type || null,
            description: metadata.description || '',
            status: metadata.status || 'draft',
            link: link,
            lecture: parseInt(metadata.lecture) || 0,
            timelineStart: metadata.timelineStart || null,
            timelineEnd: metadata.timelineEnd || null,
          });
        }
      } catch (err) {
        console.error(`Erreur lecture ${file}:`, err);
      }
    }
    
    return books;
  } catch (err) {
    console.error('Erreur scan dossier books:', err);
    return [];
  }
}