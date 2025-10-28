import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./../components/Sidebar";
import Navbar from "./../components/Navbar";
import Footer from "./../components/Footer";

function UserDashboardLayout({ darkMode, setDarkMode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div
      className={`flex ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar
        darkMode={darkMode}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          toggleSidebar={toggleSidebar}
        />
        <main className="p-4 min-h-screen pt-20">
          <Outlet /> {/* ✅ Always render Outlet - it handles all child routes including index */}
        </main>
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}

export default UserDashboardLayout;