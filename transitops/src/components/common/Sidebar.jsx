import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuthStore();

  const links = [
    { name: 'Dashboard', path: '/dashboard', roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
    { name: 'Vehicles', path: '/vehicles', roles: ['Fleet Manager', 'Financial Analyst'] },
    { name: 'Drivers', path: '/drivers', roles: ['Fleet Manager', 'Safety Officer'] },
    { name: 'Trips', path: '/trips', roles: ['Fleet Manager', 'Driver'] },
    { name: 'Maintenance', path: '/maintenance', roles: ['Fleet Manager'] },
    { name: 'Expenses', path: '/expenses', roles: ['Fleet Manager', 'Financial Analyst', 'Driver'] },
    { name: 'Reports', path: '/reports', roles: ['Fleet Manager', 'Financial Analyst'] }
  ];

  const userRole = user?.role || 'Guest';

  // Filter links by role permissions
  const filteredLinks = links.filter(link => link.roles.includes(userRole));

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-100 transform ${isOpen ? 'translate-x-0' : '-translate-x-0'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col border-r border-slate-800`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-indigo-400">TransitOps</h1>
        <button onClick={toggleSidebar} className="md:hidden text-slate-300 hover:text-white">
          ✕
        </button>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {filteredLinks.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white uppercase">
            {user?.email?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.email || 'admin@transitops.com'}</p>
            <p className="text-xs text-indigo-400 font-semibold">{userRole}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full px-4 py-2 rounded-md bg-slate-800 text-sm font-medium hover:bg-red-900/40 hover:text-red-200 transition-colors text-center block"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
