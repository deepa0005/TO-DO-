import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Star,
  CalendarDays,
  ShoppingCart,
  CheckSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Sidebar = ({ activeTab, onSelect }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainLinks = [
    { id: "my-day",     label: "My Day",      icon: <Home size={18} /> },
    { id: "important",  label: "Important",   icon: <Star size={18} /> },
    { id: "planned",    label: "Planned",     icon: <CalendarDays size={18} /> },
    { id: "groceries",  label: "Groceries",   icon: <ShoppingCart size={18} /> },
    { id: "completed",  label: "Completed",   icon: <CheckSquare size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="
        w-64 h-screen flex flex-col justify-between
        bg-gradient-to-b from-blue-50 to-blue-200
        dark:from-blue-900 dark:to-blue-800
        backdrop-blur-sm border-r border-blue-100
        p-4 text-blue-800 dark:text-blue-200
      "
    >
      {/* Top Profile + Links */}
      <div>
        {/* Profile */}
        <div className="flex items-center space-x-3 mb-6 relative">
          <div
            ref={dropdownRef}
            onClick={() => setShowDropdown((v) => !v)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="font-semibold">{user?.name || "User"}</div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-12 left-0 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow p-3 z-10">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {mainLinks.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-600 hover:text-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              {icon}
              <span className="ml-3">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Options */}
      <div className="space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
            isDark
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-600 hover:text-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          }`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
