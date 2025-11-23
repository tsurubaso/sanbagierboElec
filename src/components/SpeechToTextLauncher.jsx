import React from "react";

export default function SpeechToTextLauncher() {

    const config = {
    input_path: "C:\\Users\\space\\OneDrive\\Desktop\\Zara\\enregistrement\\test.wav",
    language: "FR-fr",
    output_path: "C:\\Users\\space\\OneDrive\\Desktop\\Zara\\enregistrement\\test.md"
  };
  const runSpeechToText = () => {
    window.electronAPI.runPythonSTT(config);
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
