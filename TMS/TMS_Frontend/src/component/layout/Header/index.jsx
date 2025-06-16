import React, { useState, useRef, useEffect } from "react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import { Avatar } from "@mui/material";

const Header = ({ onToggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex justify-between items-center px-4 py-4 md:py-6 bg-white border-b shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="md:hidden">
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Hi, {user?.fullName || 'User'}</h2>
          <p className="text-sm text-gray-500">Let's finish your task today!</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative bg-gray-100 p-2 rounded-full">
          <BellIcon className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: user?.name ? 'primary.main' : 'grey.500',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                <div className="font-medium">{user?.name}</div>
                <div className="text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
