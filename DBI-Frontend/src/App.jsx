import { useState } from "react";
import Sidebar from "./Components/Sidebar";
import ChatBox from "./Components/ChatBox";
import AuthModal from "./Components/AuthModal";
import AdminDashboard from "./Components/AdminDashboard";
import { useAppContext } from "./Context/AppContext";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import { Toaster } from "react-hot-toast";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAppContext();

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
        <AdminDashboard />
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
