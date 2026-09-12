"use client";

import { useEffect, useState } from "react";
import { UpIcon } from "./icons";

export function ButtonCorner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setVisible(false);
        return;
      }
      setVisible((window.scrollY / total) * 100 > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Kembali ke atas"
      className={`fixed bottom-4 right-4 z-40 bg-[#3b82f6] text-white p-4 rounded-full shadow-lg shadow-[#3b82f6]/30 hover:bg-[#1d4ed8] cursor-pointer transition-all duration-300 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <UpIcon className="w-5 h-5" />
    </button>
  );
}
