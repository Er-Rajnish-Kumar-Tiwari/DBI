import React, { useState } from "react";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";

const AuthModal = () => {
  const { login, authLoading } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || authLoading) return;
    await login(name, email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white dark:bg-[#0a225e] border border-[#2D4F9E]/30 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <img src={assets.logo} alt="DBI Bot" className="w-12 h-12" />
          <p className="text-xl font-semibold text-gray-800 dark:text-white">DBI Bot Super Admin</p>
          <p className="text-sm text-gray-500 dark:text-[#9FB3DE]">
            Sign in with the admin name and email to access the dashboard.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-[#9FB3DE]">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin name"
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-white/15 bg-transparent outline-none text-black dark:text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-[#9FB3DE]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-white/15 bg-transparent outline-none text-black dark:text-white placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-2 mt-2 text-white text-sm rounded-md bg-[#3D81F6] hover:bg-[#2F6BDB] disabled:opacity-50 cursor-pointer"
          >
            {authLoading ? "Please wait..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
