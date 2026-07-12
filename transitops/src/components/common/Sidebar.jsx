import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['Admin', 'Fleet Manager', 'Safety Officer', 'Financial Analyst', 'Vehicle Owner'] },
  { name: 'Vehicles', path: '/vehicles', icon: 'directions_bus', roles: ['Admin', 'Fleet Manager', 'Financial Analyst', 'Vehicle Owner'] },
  { name: 'Drivers', path: '/drivers', icon: 'person_pin_circle', roles: ['Admin', 'Fleet Manager', 'Safety Officer'] },
  { name: 'Trips', path: '/trips', icon: 'route', roles: ['Admin', 'Fleet Manager', 'Driver', 'User'] },
  { name: 'Maintenance', path: '/maintenance', icon: 'build', roles: ['Admin', 'Fleet Manager', 'Vehicle Owner'] },
  { name: 'Expenses', path: '/expenses', icon: 'receipt_long', roles: ['Admin', 'Fleet Manager', 'Financial Analyst', 'Driver', 'Vehicle Owner'] },
  { name: 'Reports', path: '/reports', icon: 'analytics', roles: ['Admin', 'Fleet Manager', 'Financial Analyst', 'Vehicle Owner'] },
];


const footerItems = [
  { name: 'Settings', icon: 'settings' },
  { name: 'Support', icon: 'help_outline' },
];

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuthStore();

  const userRole = user?.role || 'Guest';

  const filteredNav = navItems.filter(
    (item) => item.roles.includes(userRole)
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* SideNavBar Shell */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-full md:w-[260px] bg-inverse-surface flex flex-col py-lg px-md z-50
          transition-all duration-300
          md:static md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Identity */}
        <div className="flex items-center gap-md mb-3xl px-sm">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined text-2xl">directions_bus</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-surface-container-lowest leading-none">
              TransitOps
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant opacity-60">
              Fleet Management
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="ml-auto text-on-surface-variant hover:text-surface-container-lowest md:hidden"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 space-y-xs overflow-y-auto no-scrollbar">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `nav-item-transition flex items-center gap-md px-md py-sm rounded-lg group ${
                  isActive
                    ? 'text-surface-container-lowest border-l-4 border-secondary font-bold bg-surface-variant/5'
                    : 'text-on-surface-variant font-medium hover:bg-surface-variant/10 hover:text-surface-container-lowest active:scale-[0.98]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined ${isActive ? 'text-primary' : ''} group-hover:text-primary-fixed-dim`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="font-body-md">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto pt-lg border-t border-surface-variant/10 space-y-xs">
          {footerItems.map((item) => (
            <span
              key={item.name}
              className="nav-item-transition flex items-center gap-md px-md py-sm rounded-lg group text-on-surface-variant font-medium hover:bg-surface-variant/10 hover:text-surface-container-lowest active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined group-hover:text-primary-fixed-dim">
                {item.icon}
              </span>
              <span className="font-body-md">{item.name}</span>
            </span>
          ))}

          {/* User Profile */}
          <div className="flex items-center gap-md px-md py-sm mt-lg">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container uppercase">
              {user?.email?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-body-sm font-medium truncate text-surface-container-lowest">
                {user?.email || 'admin@transitops.com'}
              </p>
              <p className="font-label-caps text-label-caps text-primary-fixed-dim">
                {userRole}
              </p>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={logout}
            className="nav-item-transition flex items-center gap-md px-md py-sm rounded-lg w-full text-on-surface-variant font-medium hover:bg-surface-variant/10 hover:text-surface-container-lowest active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
