import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("dbi_admin_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [authLoading, setAuthLoading] = useState(false);

  // Identity is keyed by email + name against ADMIN_EMAIL/ADMIN_NAME on the
  // backend — only the exact admin credentials unlock the dashboard.
  const login = async (name, email) => {
    setAuthLoading(true);
    try {
      const { data } = await axios.post("/auth/login", { name, email });

      if (!data.success) {
        toast.error(data.message || "Login failed");
        return false;
      }

      const loggedInUser = { ...data.user, isAdmin: !!data.isAdmin };
      setUser(loggedInUser);
      localStorage.setItem("dbi_admin_user", JSON.stringify(loggedInUser));

      if (!loggedInUser.isAdmin) {
        toast.error("This account does not have admin access");
      }

      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dbi_admin_user");
  };

  const value = {
    user,
    authLoading,
    login,
    logout,

    axios,
    toast,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
