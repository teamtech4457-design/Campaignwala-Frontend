import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Wallet, User, ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({ darkMode, isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/user" },
    { icon: Users, label: "All Leads", path: "/user/all-leads" },
    { icon: Wallet, label: "Wallet", path: "/user/wallet-withdrawl" },
    { icon: User, label: "Profile", path: "/user/profile-overview" },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  const handleCollapse = () => {
    toggleSidebar();
  };

  return (
    <aside
      className={`fixed top-[64px] left-0 z-40 h-[calc(100%-64px)] transition-all duration-300 ease-in-out 
      ${isSidebarOpen ? "w-64" : "w-16"} 
      ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} 
      border-r shadow-md`}
    >
      {/* Collapse Button */}
      <div
        className={`p-3 border-b flex items-center justify-end 
        ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <button
          onClick={handleCollapse}
          className={`p-2 rounded-md transition-colors 
          ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleItemClick(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 
                ${
                  isActive
                    ? darkMode
                      ? "bg-gray-800 text-white border-l-2 border-blue-500"
                      : "bg-gray-100 text-gray-900 border-l-2 border-blue-600"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              title={!isSidebarOpen ? item.label : ""}
            >
              <item.icon className="flex-shrink-0" size={20} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;