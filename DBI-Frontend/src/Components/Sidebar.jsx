import React from "react";
import moment from "moment/moment";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";

const DBI_WEBSITE = "https://digitalbookofindia.com";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    theme, setTheme,
    messages, user, logout,
    conversationId, conversations, startNewChat, openConversation,
  } = useAppContext();

  const handleNewChat = () => {
    startNewChat();
    setIsMenuOpen(false);
  };

  const handleOpenConversation = (id) => {
    openConversation(id);
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`flex flex-col h-screen w-72 shrink-0 p-5 dark:bg-[#0a225e]/40 border-r border-[#2D4F9E]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-20 ${
        !isMenuOpen && "max-md:-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-2">
        <img src={assets.logo} alt="DBI Bot" className="w-9 h-9" />
        <div>
          <p className="font-semibold text-lg leading-tight">DBI Bot</p>
          <p className="text-xs text-gray-500 dark:text-[#9FB3DE]">Digital Book of India Support</p>
        </div>
      </div>

      <button
        onClick={handleNewChat}
        disabled={!conversationId && messages.length === 0}
        className="flex items-center justify-center w-full py-2 mt-6 text-white bg-[#3D81F6] text-sm rounded-md hover:bg-[#2F6BDB] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      {user && !user.isAdmin && (
        <div className="flex-1 min-h-0 mt-4 flex flex-col">
          <p className="text-xs text-gray-500 dark:text-[#9FB3DE] mb-2">Chat history</p>
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1 pr-1">
            {conversations.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-[#6C84B8]">No past chats yet.</p>
            )}

            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => handleOpenConversation(c.id)}
                className={`text-left px-3 py-2 rounded-md text-sm truncate transition-all cursor-pointer ${
                  conversationId === c.id
                    ? "bg-primary/30 dark:bg-[#14367a]/50 text-black dark:text-white"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                }`}
                title={c.title}
              >
                {c.title}
                <span className="block text-[10px] text-gray-400 dark:text-[#6C84B8]">
                  {moment(c.updatedAt).fromNow()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!(user && !user.isAdmin) && <div className="flex-1" />}

      <a
        href={DBI_WEBSITE}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.02] transition-all"
      >
        <img src={assets.gallery_icon} alt="Website" className="w-4 brightness-0 dark:invert" />
        <p className="text-sm">Visit DBI website</p>
      </a>

      {user && (
        <div className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md justify-between">
          <div className="flex items-center gap-2 text-sm min-w-0">
            <img src={assets.user_icon} alt="User" className="w-6 h-6 rounded-full shrink-0" />
            <div className="min-w-0">
              <p className="truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-[#9FB3DE] truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-xs text-gray-500 dark:text-[#9FB3DE] hover:text-purple-500 cursor-pointer shrink-0"
          >
            Logout
          </button>
        </div>
      )}

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
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-[#2D4F9E] transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      <p className="text-[10px] text-center text-gray-400 dark:text-[#6C84B8] mt-4">
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
