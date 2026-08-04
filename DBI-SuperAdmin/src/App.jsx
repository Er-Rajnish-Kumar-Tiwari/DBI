import AuthModal from "./Components/AuthModal";
import AdminDashboard from "./Components/AdminDashboard";
import { useAppContext } from "./Context/AppContext";
import { assets } from "./assets/assets";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, logout } = useAppContext();

  if (!user) {
    return (
      <>
        <AuthModal />
        <Toaster />
      </>
    );
  }

  if (!user.isAdmin) {
    return (
      <>
        <div className="flex h-screen w-screen items-center justify-center bg-white text-black dark:bg-[#0a225e] dark:text-white px-4">
          <div className="flex flex-col items-center text-center gap-3">
            <img src={assets.logo} alt="DBI Bot" className="h-28 w-auto object-contain" />
            <p className="text-xl font-semibold">Access denied</p>
            <p className="text-sm text-gray-500 dark:text-[#9FB3DE]">
              This account does not have super admin access.
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
      <AdminDashboard />
      <Toaster />
    </>
  );
}

export default App;
