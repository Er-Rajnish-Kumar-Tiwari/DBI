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

  // Always "auto": the bot mirrors whatever language the user types in.
  // There is no UI to change this anymore.
  const lang = "auto";

  const [user, setUser] = useState(getStoredUser);
  const [authLoading, setAuthLoading] = useState(false);

  // Each chat thread is a separate "conversation" (like ChatGPT/Claude) —
  // conversationId null means the current view is an unsaved new chat.
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);

  const refreshConversations = async (userId) => {
    const id = userId || user?.id;
    if (!id) return [];

    try {
      const { data } = await axios.get(`/chat/conversations/${id}`);
      if (data.success) {
        setConversations(data.conversations);
        return data.conversations;
      }
    } catch {
      // Non-fatal: sidebar history list just stays as-is.
    }
    return [];
  };

  const openConversation = async (id) => {
    try {
      const { data } = await axios.get(`/chat/conversations/${id}/messages`);
      if (data.success) {
        setConversationId(id);
        setMessages(data.messages);
      }
    } catch {
      toast.error("Failed to open that chat");
    }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
  };

  // Identity is keyed by email: an existing email logs in (old chats reappear
  // in the sidebar), a new email signs up. The admin email/name from .env is
  // the one exception — both must match to unlock the dashboard.
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
        const list = await refreshConversations(loggedInUser.id);
        if (list.length > 0) {
          await openConversation(list[0].id);
        } else {
          startNewChat();
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
    setConversationId(null);
    setConversations([]);
    localStorage.removeItem("dbi_user");
  };

  // Reopen a returning user's most recent chat on page refresh (login() only
  // does this right after a fresh submit, not on an already-stored session).
  useEffect(() => {
    if (user && !user.isAdmin && user.id) {
      refreshConversations(user.id).then((list) => {
        if (list.length > 0) openConversation(list[0].id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    messages,
    setMessages,

    loading,
    setLoading,

    lang,

    conversationId,
    setConversationId,
    conversations,
    refreshConversations,
    openConversation,
    startNewChat,

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
