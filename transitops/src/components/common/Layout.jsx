import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="font-body-md text-on-background min-h-screen flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 md:ml-[260px] flex flex-col h-screen overflow-y-auto">
        <Navbar
          toggleSidebar={toggleSidebar}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <section className="p-xl max-w-[1440px] w-full mx-auto space-y-xl">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
