"use client";

import { useState } from "react";
import Link from "next/link";


export default function TopBar({ onToggleLeft, onToggleRight, navItems = [] }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-[90%]"
      }`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <header className="flex justify-between items-center bg-[#0f0f0f] text-white p-3 border-b border-gray-700 shadow-md">
        <button
          onClick={onToggleLeft}
          className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-500"
        >
          ☰ Left
        </button>
        {/* === Centre : titre + boutons s'il y en a === */}
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold mr-2">SanBagierBo</h1>
          {/* Si on a des navItems, on les affiche */}
          <div className="flex items-center justify-center space-x-3 flex-1">
            {Array.isArray(navItems) &&
              navItems.length > 0 &&
              navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 text-sm"
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
        {/* === Bouton droite : toggle sidebar droite === */}
        <button
          onClick={onToggleRight}
          className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-500"
        >
          ☰ Right
        </button>
      </header>
    </div>
  );
}
