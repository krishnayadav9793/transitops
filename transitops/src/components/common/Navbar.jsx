import { useAuthStore } from '../../store/authStore';

export const Navbar = ({ toggleSidebar, theme, toggleTheme }) => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-md md:px-xl py-sm h-16 border-b border-outline-variant shadow-sm transition-opacity duration-200">
      {/* Left: Search & Breadcrumbs */}
      <div className="flex items-center gap-sm md:gap-xl flex-1">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low hover:text-primary md:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative w-full max-w-[120px] xs:max-w-[160px] sm:max-w-xs md:max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-2 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm text-sm"
          />
          <div className="absolute right-md top-1/2 -translate-y-1/2 hidden md:flex items-center gap-xs">
            <kbd className="px-1.5 py-0.5 rounded border border-outline-variant bg-surface-container-low text-[10px] font-medium text-on-surface-variant">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-outline-variant bg-surface-container-low text-[10px] font-medium text-on-surface-variant">
              K
            </kbd>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-sm text-on-surface-variant font-medium">
          <span className="hover:text-primary transition-colors cursor-pointer font-body-sm">
            Home
          </span>
          <span className="material-symbols-outlined text-sm opacity-30">
            chevron_right
          </span>
          <span className="text-primary font-bold font-body-sm border-b-2 border-primary pb-1">
            Dashboard
          </span>
        </nav>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-xs sm:gap-md">
        <button className="hidden sm:flex bg-primary text-on-primary px-lg py-sm rounded-xl font-body-md font-semibold items-center gap-sm hover:opacity-90 active:scale-95 transition-all shadow-sm">
          <span className="material-symbols-outlined text-sm">add</span>
          New Trip
        </button>

        <div className="flex items-center gap-xs pr-xs sm:pr-md border-r border-outline-variant">
          <button className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary relative group">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-secondary rounded-full ring-2 ring-surface group-hover:ring-surface-container-low transition-all" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary"
            id="theme-toggle"
          >
            <span className="material-symbols-outlined text-[20px]">contrast</span>
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-xs sm:gap-md pl-xs sm:pl-sm cursor-pointer group">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors truncate max-w-[120px]">
              {user?.email || 'Alex Fleet'}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant opacity-70">
              {user?.role || 'Fleet Administrator'}
            </span>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-outline-variant group-hover:border-primary transition-all overflow-hidden bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface uppercase">
            {user?.email?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
