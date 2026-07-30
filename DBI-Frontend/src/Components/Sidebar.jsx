import React from "react";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";

const DBI_WEBSITE = "https://digitalbookofindia.com";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { theme, setTheme, lang, setLang, clearChat, messages } = useAppContext();

  const handleNewChat = () => {
    clearChat();
    setIsMenuOpen(false);
  };

  const languages = [
    { code: "auto", label: "Auto" },
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
  ];

  return (
    <div
      className={`flex flex-col h-screen w-72 shrink-0 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-20 ${
        !isMenuOpen && "max-md:-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-2">
        <img src={assets.logo} alt="DBI Bot" className="w-9 h-9" />
        <div>
          <p className="font-semibold text-lg leading-tight">DBI Bot</p>
          <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">Digital Book of India Support</p>
        </div>
      </div>

      <button
        onClick={handleNewChat}
        disabled={messages.length === 0}
        className="flex items-center justify-center w-full py-2 mt-6 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md hover:from-[#CDA1FF] hover:to-[#80609F] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      <div className="mt-6">
        <p className="text-xs text-gray-500 dark:text-[#B1A6C0] mb-2">Reply language</p>
        <div className="flex gap-2">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`flex-1 py-1.5 text-xs rounded-md border transition-all cursor-pointer ${
                lang === l.code
                  ? "bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-white border-transparent"
                  : "border-gray-300 dark:border-white/15 text-gray-600 dark:text-gray-300"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <a
        href={DBI_WEBSITE}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 mt-6 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.02] transition-all"
      >
        <img src={assets.gallery_icon} alt="Website" className="w-4 brightness-0 dark:invert" />
        <p className="text-sm">Visit DBI website</p>
      </a>

      <div className="flex-1" />

      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md justify-between">
        <div className="flex items-center gap-2 text-sm">
          <img src={assets.theme_icon} alt="Theme" className="w-4 brightness-0 dark:invert" />
          <p>Dark Mode</p>
        </div>

        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      <p className="text-[10px] text-center text-gray-400 dark:text-[#6B6178] mt-4">
        DBI Bot can make mistakes. Verify important info on the DBI website.
      </p>

      <img
        src={assets.close_icon}
        alt="Close"
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden brightness-0 dark:invert"
        onClick={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
