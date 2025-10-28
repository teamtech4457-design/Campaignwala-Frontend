 import React from "react";

const Footer = ({ darkMode }) => {
  return (
    <footer
      className={`mt-auto border-t w-full transition-all duration-300
        ${darkMode
          ? "bg-gray-800 border-gray-700 text-gray-400"
          : "bg-white border-gray-200 text-gray-600"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-sm flex-wrap">
          
          {/* Left Links */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Company</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          </div>

          {/* Right Icons */}
          <div className="flex justify-center sm:justify-end gap-5 text-lg">
            <a href="#" className="hover:text-blue-600 transition-colors">🌐</a>
            <a href="#" className="hover:text-blue-600 transition-colors">📷</a>
            <a href="#" className="hover:text-blue-600 transition-colors">💼</a>
          </div>
        </div>

        <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
          © Campaignwala by codessy
        </div>
      </div>
    </footer>
  );
};

export default Footer;