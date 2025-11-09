import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Rules = lazy(() => import("./pages/BILLY/Rules"));
const StoryList = lazy(() => import("./pages/BILLY/storylist"));
const DraftList = lazy(() => import("./pages/BILLY/draftlist"));
const FragmentList = lazy(() => import("./pages/BILLY/fragmentlist"));
const OtherList = lazy(() => import("./pages/BILLY/otherlist"));
const IllustrationList = lazy(() => import("./pages/BILLY/illustrationlist"));


function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div>Chargement…</div>}>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/BILLY/Rules" element={<Rules />} />
          <Route path="/BILLY/storylist" element={<StoryList />} />
          <Route path="/BILLY/draftlist" element={<DraftList />} />
          <Route path="/BILLY/fragmentlist" element={<FragmentList />} />
          <Route path="/BILLY/otherlist" element={<OtherList />} />
          <Route path="/BILLY/illustrationlist" element={<IllustrationList />} />

          {/* optional: catch-all */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
