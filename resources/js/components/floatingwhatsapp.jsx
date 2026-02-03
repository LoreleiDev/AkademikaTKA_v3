import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsapp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center">
      
      {/* PANEL MEMANJANG */}
      <div
        className={`
          overflow-hidden
          transition-all duration-300 ease-in-out
          bg-[#0AA3E3]
          rounded-full
          flex items-center
          ${open ? "w-[320px] px-6 py-3 mr-3" : "w-0 px-0 py-0 mr-0"}
        `}
      >
        <div
          className={`
            text-white text-sm leading-relaxed whitespace-nowrap
            transition-opacity duration-200
            ${open ? "opacity-100" : "opacity-0"}
          `}
        >
          <p className="font-semibold">Customer Service</p>
          <p className="font-semibold">Kak VAN : 085123456789</p>
          <p className="font-semibold">Kak FAL : 085784073063</p>
        </div>
      </div>

      {/* TOMBOL WA */}
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full bg-[#0AA3E3] flex items-center justify-center shadow-lg hover:scale-105 transition"
      >
        <FaWhatsapp className="text-white text-3xl" />
      </button>
    </div>
  );
}
