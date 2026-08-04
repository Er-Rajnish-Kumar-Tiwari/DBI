import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("dbi_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AppContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(
    localStorage.getItem("dbi_theme") || "light"
  );

  // "auto" lets the bot mirror whatever language the user types in
  const [lang, setLang] = useState(
    localStorage.getItem("dbi_lang") || "auto"
  );

  const [user, setUser] = useState(getStoredUser);
  const [authLoading, setAuthLoading] = useState(false);

  const clearChat = () => setMessages([]);

  // Identity is keyed by email: an existing email logs in (old chat history
  // is loaded back in), a new email signs up. The admin email/name from
  // .env is the one exception — both must match to unlock the dashboard.
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
      localStorage.setItem("dbi_user", JSON.stringify(loggedInUser));

      if (!data.isAdmin && loggedInUser.id) {
        try {
          const historyRes = await axios.get(`/chat/history/${loggedInUser.id}`);
          if (historyRes.data.success) {
            setMessages(historyRes.data.messages);
          }
        } catch {
          // Non-fatal: user can still chat even if history fails to load.
        }

        toast.success(data.isNew ? `Welcome, ${loggedInUser.name}!` : `Welcome back, ${loggedInUser.name}!`);
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
    setMessages([]);
    localStorage.removeItem("dbi_user");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("dbi_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("dbi_lang", lang);
  }, [lang]);

  // Reload a returning user's saved history on page refresh (login() only
  // fetches it right after a fresh submit, not on an already-stored session).
  useEffect(() => {
    if (user && !user.isAdmin && user.id) {
      axios
        .get(`/chat/history/${user.id}`)
        .then(({ data }) => {
          if (data.success) setMessages(data.messages);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Admin API calls are guarded server-side by these headers.
  useEffect(() => {
    if (user?.isAdmin) {
      axios.defaults.headers.common["x-admin-email"] = user.email;
      axios.defaults.headers.common["x-admin-name"] = user.name;
    } else {
      delete axios.defaults.headers.common["x-admin-email"];
      delete axios.defaults.headers.common["x-admin-name"];
    }
  }, [user]);

  const value = {
    messages,
    setMessages,

    loading,
    setLoading,

    theme,
    setTheme,

    lang,
    setLang,

    clearChat,

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
