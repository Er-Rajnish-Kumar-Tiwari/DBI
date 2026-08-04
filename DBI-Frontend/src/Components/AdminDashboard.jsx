import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

const AdminDashboard = () => {
  const { axios, toast, logout, user } = useAppContext();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get("/admin/users");
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

  const openUser = async (u) => {
    setSelectedUser(u);
    setLoadingHistory(true);
    try {
      const { data } = await axios.get(`/admin/users/${u.id}/messages`);
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
      <div className="flex flex-col w-80 shrink-0 h-full border-r border-[#2D4F9E]/30 p-5 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <img src={assets.logo} alt="DBI Bot" className="w-9 h-9" />
          <div>
            <p className="font-semibold text-lg leading-tight">Admin Dashboard</p>
            <p className="text-xs text-gray-500 dark:text-[#9FB3DE]">{user?.name}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-2 mt-4 mb-4 text-sm rounded-md border border-gray-300 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
        >
          Logout
        </button>

        <p className="text-xs text-gray-500 dark:text-[#9FB3DE] mb-2">
          {loadingUsers ? "Loading users..." : `${users.length} user${users.length === 1 ? "" : "s"}`}
        </p>

        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => openUser(u)}
              className={`text-left p-3 rounded-md border transition-all cursor-pointer ${
                selectedUser?.id === u.id
                  ? "border-transparent bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-white"
                  : "border-gray-300 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <p className="text-sm font-medium truncate">{u.name}</p>
              <p className={`text-xs truncate ${selectedUser?.id === u.id ? "text-white/80" : "text-gray-500 dark:text-[#9FB3DE]"}`}>
                {u.email}
              </p>
              <div className={`flex items-center justify-between mt-1 text-[10px] ${selectedUser?.id === u.id ? "text-white/70" : "text-gray-400 dark:text-[#6C84B8]"}`}>
                <span>{u.messageCount} messages</span>
                <span>{moment(u.lastActiveAt).fromNow()}</span>
              </div>
            </button>
          ))}

          {!loadingUsers && users.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-[#6C84B8] mt-4 text-center">No users yet.</p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col m-5 md:m-10">
        {!selectedUser && (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-[#6C84B8] text-sm">
            Select a user to view their chat history.
          </div>
        )}

        {selectedUser && (
          <>
            <div className="mb-4 pb-4 border-b border-[#2D4F9E]/20">
              <p className="text-xl font-semibold">{selectedUser.name}</p>
              <p className="text-sm text-gray-500 dark:text-[#9FB3DE]">{selectedUser.email}</p>
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
