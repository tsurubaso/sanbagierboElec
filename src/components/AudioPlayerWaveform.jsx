import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function AudioWavePlayer() {
  const containerRef = useRef(null);
  const waveRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  // Create WaveSurfer instance
  useEffect(() => {
    if (!containerRef.current) return;

    waveRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#d1d5db",
      progressColor: "#3b82f6",
      height: 120,
      responsive: true,
    });

    waveRef.current.on("finish", () => setIsPlaying(false));

    return () => waveRef.current.destroy();
  }, []);

  // Load file into WaveSurfer
  useEffect(() => {
    if (audioFile && waveRef.current) {
      const url = URL.createObjectURL(audioFile);
      waveRef.current.load(url);
    }
  }, [audioFile]);

  const togglePlay = () => {
    if (!waveRef.current) return;

    waveRef.current.playPause();
    setIsPlaying(waveRef.current.isPlaying());
  };

  return (
    <div className="p-4 space-y-4 w-full">
      
      {/* File import */}
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => {
          if (e.target.files?.[0]) setAudioFile(e.target.files[0]);
        }}
        className="block text-sm"
      />

      {/* Waveform */}
      <div
        ref={containerRef}
        className="w-full border rounded bg-gray-100"
      />

      {/* Controls */}
      <button
        onClick={togglePlay}
        disabled={!audioFile}
        className={`py-2 px-4 rounded text-white font-bold ${
          audioFile
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
