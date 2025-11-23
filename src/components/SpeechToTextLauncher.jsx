import React from "react";

export default function SpeechToTextLauncher() {
  const runSpeechToText = () => {
    window.electronAPI.runPythonSTT();
  };

  return (
    <div className="p-3 flex flex-col items-center">
      <button
        onClick={runSpeechToText}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow"
      >
        🎤 Transcrire un audio
      </button>
    </div>
  );
}
