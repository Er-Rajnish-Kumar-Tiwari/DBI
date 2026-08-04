import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

const AdminDashboard = () => {
  const { axios, toast, logout, user } = useAppContext();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Sent explicitly on every admin call (rather than as an axios default)
  // so there's no dependency on effect-ordering/timing after login.
  const adminHeaders = {
    "x-admin-email": user?.email,
    "x-admin-name": user?.name,
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get("/admin/users", { headers: adminHeaders });
      if (data.success) setUsers(data.users);
      else toast.error(data.message || "Failed to load users");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openConversation = async (owner, conversation) => {
    setSelectedOwner(owner);
    setSelectedConversation(conversation);
    setLoadingHistory(true);
    try {
      const { data } = await axios.get(`/admin/conversations/${conversation.id}/messages`, { headers: adminHeaders });
      if (data.success) setHistory(data.messages);
      else toast.error(data.message || "Failed to load chat history");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load chat history");
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white text-black dark:bg-[#0a225e] dark:text-white">
      <div className="flex flex-col w-80 shrink-0 h-full border-r border-[#2D4F9E]/30 p-5">
        <div className="flex items-center gap-2">
          <img src={assets.logo} alt="DBI Bot" className="w-9 h-9" />
          <div>
            <p className="font-semibold text-lg leading-tight">DBI Bot Admin</p>
            <p className="text-xs text-gray-500 dark:text-[#9FB3DE]">{user?.name}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-[#9FB3DE] mt-6 mb-2">
          {loadingUsers ? "Loading chat history..." : "Chat history"}
        </p>

        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 pr-1">
          {users.map((u) => (
            <div
              key={u.id}
              className="border border-gray-300 dark:border-white/15 rounded-md p-3"
            >
              <p className="text-sm font-medium truncate">{u.email}</p>
              <p className="text-xs text-gray-500 dark:text-[#9FB3DE] truncate mb-2">{u.name}</p>

              <div className="flex flex-col gap-1">
                {u.conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => openConversation(u, c)}
                    className={`text-left px-2 py-1.5 rounded-md text-sm truncate transition-all cursor-pointer ${
                      selectedConversation?.id === c.id
                        ? "bg-[#3D81F6] text-white"
                        : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                    }`}
                    title={c.title}
                  >
                    {c.title}
                    <span
                      className={`block text-[10px] ${
                        selectedConversation?.id === c.id ? "text-white/80" : "text-gray-400 dark:text-[#6C84B8]"
                      }`}
                    >
                      {moment(c.updatedAt).fromNow()}
                    </span>
                  </button>
                ))}

                {u.conversations.length === 0 && (
                  <p className="text-xs text-gray-400 dark:text-[#6C84B8]">No chats yet.</p>
                )}
              </div>
            </div>
          ))}

          {!loadingUsers && users.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-[#6C84B8] mt-4 text-center">No users yet.</p>
          )}
        </div>

        <button
          onClick={logout}
          className="w-full py-2 mt-4 text-sm rounded-md border border-gray-300 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer shrink-0"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 flex flex-col m-5 md:m-10">
        {!selectedConversation && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <img src={assets.logo} alt="DBI Bot" className="w-16 h-16" />
            <p className="text-3xl sm:text-5xl text-gray-700 dark:text-white font-medium">Welcome, Admin</p>
            <p className="text-base sm:text-lg text-gray-400 dark:text-gray-300">
              Select a chat from the left to view its history.
            </p>
          </div>
        )}

        {selectedConversation && (
          <>
            <div className="mb-4 pb-4 border-b border-[#2D4F9E]/20">
              <p className="text-xl font-semibold">{selectedConversation.title}</p>
              <p className="text-sm text-gray-500 dark:text-[#9FB3DE]">
                {selectedOwner.name} · {selectedOwner.email}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingHistory && <p className="text-sm text-gray-400">Loading chat history...</p>}

              {!loadingHistory && history.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-[#6C84B8]">No messages yet.</p>
              )}

              {!loadingHistory && history.map((message, index) => (
                <Message key={index} message={message} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
