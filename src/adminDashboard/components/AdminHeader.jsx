import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context-api/ThemeContext";

export default function AdminHeader({ setSidebarOpen }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 dark:text-gray-400"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
