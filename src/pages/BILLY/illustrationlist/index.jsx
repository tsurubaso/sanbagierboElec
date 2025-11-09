import { useNavigate } from "react-router-dom";

import MotionEffects from "@/components/MotionEffects";
const { PulseText, FadeIn, GradientText, HoverZoom } = MotionEffects;

export default function NotFoundIllustrations() {
      const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Home Page</h1>

        {/* Go to some route */}
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
        >
          Go to Home
        </button>

        {/* Go back to previous page */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
      
      <PulseText text="Et ben non !" className="text-violet-700 text-6xl mb-4" />
      <FadeIn delay={0.5}>
        <GradientText text="Pas d'illustrations mais ça va venir !" className="text-2xl mb-2" />
      </FadeIn>
      <p className="text-gray-400 mb-6">Photos, dessins, 3D… tout est en pause 🎨</p>

    </div>
  );
}
