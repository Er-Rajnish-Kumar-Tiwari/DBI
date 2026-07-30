import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

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

  const clearChat = () => setMessages([]);

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

    axios,
    toast,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
