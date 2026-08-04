import { useState } from "react";
import Sidebar from "./Components/Sidebar";
import ChatBox from "./Components/ChatBox";
import AuthModal from "./Components/AuthModal";
import { useAppContext } from "./Context/AppContext";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import { Toaster } from "react-hot-toast";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAppContext();

  if (!user) {
    return (
      <>
        <AuthModal />
        <Toaster />
      </>
    );
  }

  if (user.isAdmin) {
    return (
      <>
        <div className="flex h-screen w-screen items-center justify-center bg-white text-black dark:bg-[#0a225e] dark:text-white px-4">
          <div className="flex flex-col items-center text-center gap-3">
            <img src={assets.logo} alt="DBI Bot" className="h-28 w-auto object-contain" />
            <p className="text-xl font-semibold">Admin access</p>
            <p className="text-sm text-gray-500 dark:text-[#9FB3DE]">
              Please use the Super Admin dashboard to manage conversations.
            </p>
            <button
              onClick={logout}
              className="mt-2 px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          alt="Menu Icon"
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden brightness-0 dark:invert z-10"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      <div className="bg-white text-black dark:bg-[#0a225e] dark:text-white transition-all duration-300">
        <div className="flex h-screen w-screen">
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <ChatBox />
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default App;
