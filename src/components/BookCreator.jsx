import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function BookCreator() {
  const initialTemplate = `---
illu_author: 
text_author: 
title: 
type: 
description: ""
status: 
link: 
lecture: 0
timelineStart: 
timelineEnd: 
---

# Titre
`;

  const [code, setCode] = useState(initialTemplate); // prefill editor
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!code.trim()) return; // nothing to save
    setSaving(true);

    try {
      // Call your Electron API to save in the submodule
      // We'll assume you add a function `createOrUpdateBook(fileName, content)`
      const fileName = `new_book_${Date.now()}`; // unique filename
      await window.electronAPI.createOrUpdateBook(fileName, code);

      alert(`✅ Saved as ${fileName}.md`);
      setCode(""); // clear editor after saving
    } catch (err) {
      console.error("Error saving book:", err);
      alert("❌ Failed to save book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 border rounded overflow-hidden shadow-md">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          defaultValue={code}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-light" // white background
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            wordWrap: "on",
          }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !code.trim()}
        className={`mt-4 py-2 px-4 rounded text-white font-bold ${
          saving || !code.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {saving ? "Saving..." : "Create / Save"}
      </button>
    </div>
  );
}
