"use client";

import { use, useState, useEffect } from "react";
import InteractiveMerge from "@/components/InteractiveMerge";

//MERGER PAGE

export default function MergerPage({ params }) {
  const { link: book, merger: secret} = use(params);



  const [branches, setBranches] = useState({});
  const [branchList, setBranchList] = useState([]);
  const [sourceBranch, setSourceBranch] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [mergedText, setMergedText] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/github/merge?book=${book}`);
      const data = await res.json();
      if (data.error) {
        console.error("❌", data.error);
        return;
      }
      setBranchList(data.branches);
      setBranches(data.contents);
    }
    load();
  }, [book]);

  const isMergeDisabled =
    !sourceBranch ||
    !targetBranch ||
    sourceBranch === targetBranch ||
    sourceBranch === "master";

  function handleMergedChange(text) {
    setMergedText(text);
    setHasChanges(true);
  }

  const SECRET_KEY2 = process.env.NEXT_PUBLIC_MERGER_SECRET_KEY;

      // Vérifie le secret
  if (secret !== SECRET_KEY2) {
    return <p style={{ padding: "2rem", color: "red" }}>Unauthorized </p>;
  }

  async function handleSave() {
    if (!hasChanges || !targetBranch) return;

    try {
      const res = await fetch("/api/github/save-merged", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book, targetBranch, mergedText }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Merged result saved to ${targetBranch}`);

        // Supprimer la branche source si ce n'est pas master
        if (sourceBranch !== "master") {
          await fetch("/api/github/delete-branch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ branch: sourceBranch }),
          });
          alert(`🗑 Source branch ${sourceBranch} deleted`);
        }

        // Rafraîchir la liste des branches
        setHasChanges(false);
        const refresh = await fetch(`/api/github/merge?book=${book}`);
        const data2 = await refresh.json();
        setBranchList(data2.branches);
        setBranches(data2.contents);
        setSourceBranch("");
        setTargetBranch("");
        setMergedText("");
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Fusion interactive</h1>

      {/* Sélecteurs */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm font-semibold">Source</label>
          <select
            value={sourceBranch}
            onChange={(e) => setSourceBranch(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Choisir --</option>
            {branchList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold">Cible</label>
          <select
            value={targetBranch}
            onChange={(e) => setTargetBranch(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Choisir --</option>
            {branchList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bouton fusionner */}
      <button
        disabled={isMergeDisabled}
        onClick={() => setHasChanges(false)}
        className={`px-4 py-2 rounded font-semibold ${
          isMergeDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isMergeDisabled
          ? "Fusion impossible"
          : `Fusionner ${sourceBranch} → ${targetBranch}`}
      </button>

      {/* InteractiveMerge */}
      {sourceBranch && targetBranch && !isMergeDisabled && (
        <div className="mt-8">
          <InteractiveMerge
            original={branches[targetBranch]}
            modified={branches[sourceBranch]}
            onMerge={handleMergedChange}
          />

          {/* Bouton Save */}
          {hasChanges && (
            <button
              onClick={handleSave}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              💾 Save merged result to {targetBranch}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
