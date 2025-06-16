import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import {
  Squares2X2Icon,
  BookOpenIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "Overview", icon: Squares2X2Icon, path: "/" },
  { name: "Task", icon: BookOpenIcon, path: "/task" },
  { name: "Users", icon: UserGroupIcon, path: "/user-list", adminOnly: true },
];

export default function Sidebar({ isOpen, onClose }) {
  const [helpExpanded, setHelpExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin());

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) { // Close sidebar on mobile after navigation
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r px-4 py-6 transform transition-transform duration-300 md:relative md:translate-x-0 md:block ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar content */}
        <div className="flex flex-col justify-between h-full">
          {/* Top: Logo, Close button and Navigation */}
          <div>
            {/* Topbar with Logo and Close Button */}
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-200 p-2 rounded-md">
                  <BookOpenIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-xl font-semibold">TMS</span>
              </div>

              {/* Close button (only on mobile) */}
              <div className="md:hidden">
                <button onClick={onClose}>
                  <XMarkIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4">
              {filteredNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                    location.pathname === item.path
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom: Help Center */}
          <div
            className={`bg-gray-900 text-white px-4 py-4 rounded-xl shadow-lg transition-all duration-300 ${
              helpExpanded ? "min-h-[220px]" : "min-h-[100px]"
            } flex flex-col items-center justify-between mt-6`}
          >
            <div className="flex justify-center -mt-10 mb-2 relative">
              <div className="p-2 rounded-full shadow-md bg-white relative z-10">
                <QuestionMarkCircleIcon className="w-6 h-6 text-gray-900" />
              </div>
              <div className="absolute top-1 left-1 w-10 h-10 bg-indigo-400 rounded-full blur-md opacity-60 z-0"></div>
            </div>

            <div className="flex justify-between items-center w-full mb-2">
              <h3 className="font-semibold text-sm">Help Center</h3>
              <button onClick={() => setHelpExpanded(!helpExpanded)}>
                {helpExpanded ? (
                  <ChevronUpIcon className="w-4 h-4 text-white" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            {helpExpanded ? (
              <div className="text-center">
                <p className="text-xs text-gray-300 mb-4">
                  Having trouble in learning? Please contact us for more
                  questions.
                </p>
                <button className="bg-white text-gray-900 text-sm px-4 py-1 rounded-md font-medium">
                  Go To Help Center
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-300 text-center mt-2">
                Need help?
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
