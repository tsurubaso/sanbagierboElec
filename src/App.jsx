import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";

// Lazy load pages
const Rules = lazy(() => import("@/pages/Rules"));
const IllustrationList = lazy(() => import("@/pages/illustrationlist"));
const Reader = lazy(() => import("@/pages/Reader"));
const Editor = lazy(() => import("@/pages/Editor"));
const GridPage = lazy(() => import("@/pages/GridPage"));

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="p-6">Chargement...</div>}>
        <Routes>
          {/* 🏠 Page principale */}
          <Route path="/" element={<Home />} />

          {/* 📘 Règles */}
          <Route path="/:person/Rules" element={<Rules />} />

          {/* 🖼️ Illustrations */}
          <Route path="/:person/illustrationlist" element={<IllustrationList />} />

          {/* 📚 Liste générique (draft, story, fragment, etc.) */}
          <Route path="/:person/:statuslist" element={<GridPage />} />

          {/* 📖 Reader */}
          <Route path="/:person/:statuslist/:link/reader" element={<Reader />} />

          {/* ✏️ Editor */}
          <Route path="/:person/:statuslist/:link/editor" element={<Editor />} />

          {/* ⚠️ Fallback */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
