import { useState } from "react";
import Sidebar from "./Components/Sidebar";
import ChatBox from "./Components/ChatBox";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import { Toaster } from "react-hot-toast";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      <div className="bg-white text-black dark:bg-gradient-to-b dark:from-[#242124] dark:to-black dark:text-white transition-all duration-300">
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
