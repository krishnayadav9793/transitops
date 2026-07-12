import React from 'react';
import { useAuthStore } from '../../store/authStore';

export const Navbar = ({ toggleSidebar, theme, toggleTheme }) => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none md:hidden dark:text-gray-400 dark:hover:text-gray-200"
        >
          ☰
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden md:block">
          Smart Transport Control
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors"
          title="Toggle Dark Mode"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-800"></div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.email || 'admin@transitops.com'}
          </span>
          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            {user?.role || 'Fleet Manager'}
          </span>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
