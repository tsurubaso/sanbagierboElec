import { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import AudioZoomControls from "./AudioZoomControls";

export default function AudioEditor({ audioPath }) {
  const containerRef = useRef(null);
  const wsRef = useRef(null);

  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (!containerRef.current) return;

    wsRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#a0a0ff",
      progressColor: "#4a46e3",
      cursorColor: "#333",
      height: 120,
    });

    return () => wsRef.current?.destroy();
  }, []);

  // Load audio when path changes
  useEffect(() => {
    if (!wsRef.current || !audioPath) return;
    wsRef.current.load("file://" + audioPath);
  }, [audioPath]);

  // Apply zoom when state changes
  const applyZoom = (z) => {
    wsRef.current.zoom(z);
  };

  return (
    <div className="p-3">
      <div
        ref={containerRef}
        className="border rounded shadow h-[140px]"
      />

      <AudioZoomControls
        zoom={zoom}
        setZoom={setZoom}
        onChange={applyZoom}
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => wsRef.current.playPause()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          ▶️ Play / Pause
        </button>
      </div>
    </div>
  );
}
