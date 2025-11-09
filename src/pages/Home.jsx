import React from "react";
import MotionEffects from "../components/MotionEffects";
import { useNavigate } from "react-router-dom";

const {
  //PulseText,
  //FadeIn,
  GradientText,
  //TypingText,
  //HoverZoom,
  HeroSection,
  ScrollColorSection,
  ScrollShiftSection,
  AnimatedText,
  SlideIn,
} = MotionEffects;

const Home = () => {
  const navigate = useNavigate();
  const routes = [
    { label: "Rules", path: "/BILLY/Rules" },
    { label: "Illustrations", path: "/BILLY/illustrationlist" },
  ];
  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <h1 className="text-5xl font-bold text-white">Hello Tailwind! 🚀</h1>
      </div>
      <h1 className="text-3xl font-bold text-blue-500">Hello Tailwind!</h1>
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <div className="flex flex-col gap-2">
        {routes.map((route) => (
          <button
            key={route.path}
            onClick={() => handleClick(route.path)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {route.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
