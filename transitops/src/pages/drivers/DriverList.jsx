import React, { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import { SearchInput } from '../../components/ui/FilterBar';

export const DriverList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const drivers = [
    { id: 'TR-8842', name: 'Elena Rodriguez', status: 'On Trip', vehicle: 'Volvo FH Electric (TX-992-K)', licenseExpiry: 'Oct 24, 2025', safetyScore: 98, efficiency: 92 },
    { id: 'TR-9104', name: 'David Miller', status: 'Off Duty', vehicle: null, licenseExpiry: 'Aug 12, 2024', safetyScore: 84, efficiency: 78 },
    { id: 'TR-7721', name: 'Suki Tanaka', status: 'Active', vehicle: 'Scania R450 (KY-110-M)', licenseExpiry: 'Jan 30, 2026', safetyScore: 96, efficiency: 95 },
    { id: 'TR-0051', name: 'Jordan Smyth', status: 'Suspended', vehicle: 'Grounded', licenseExpiry: 'Dec 05, 2024', safetyScore: 42, efficiency: 15 },
  ];

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Driver Management</h2>
          <p className="text-on-surface-variant mt-xs">Manage your fleet drivers and their assignments.</p>
        </div>
        <button className="bg-primary hover:bg-primary-container text-white font-headline-sm px-xl py-md rounded-lg flex items-center gap-sm transition-all shadow-md active:scale-95">
          <span className="material-symbols-outlined">person_add</span>
          <span>Add Driver</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/10">
          <p className="font-label-caps text-label-caps text-outline uppercase mb-1">Total Fleet Strength</p>
          <h3 className="font-kpi-lg text-kpi-lg text-on-surface">1,284</h3>
          <div className="mt-4 flex items-center text-primary font-bold text-body-sm">
            <span className="material-symbols-outlined mr-1">trending_up</span>
            +4.2% from last month
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/10">
          <p className="font-label-caps text-label-caps text-outline uppercase mb-1">Active Now</p>
          <h3 className="font-kpi-lg text-kpi-lg text-on-surface">942</h3>
          <div className="mt-4 flex items-center text-outline font-medium text-body-sm">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            73% Utilization
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/10">
          <p className="font-label-caps text-label-caps text-outline uppercase mb-1">Safety Avg.</p>
          <h3 className="font-kpi-lg text-kpi-lg text-on-surface">94.8</h3>
          <div className="mt-4 flex items-center text-primary font-bold text-body-sm">
            <span className="material-symbols-outlined mr-1">check_circle</span>
            Top Tier Rating
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/10">
          <p className="font-label-caps text-label-caps text-error uppercase mb-1">Action Required</p>
          <h3 className="font-kpi-lg text-kpi-lg text-error">12</h3>
          <div className="mt-4 flex items-center text-error font-medium text-body-sm">
            <span className="material-symbols-outlined mr-1 text-[18px]">warning</span>
            Licenses Expiring Soon
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-lg mb-lg flex flex-wrap items-center gap-lg border border-surface-container">
        <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-outline-variant/20">
          <button className="px-lg py-sm rounded-lg font-label-caps text-label-caps uppercase bg-primary text-on-primary">All Drivers</button>
          <button className="px-lg py-sm rounded-lg font-label-caps text-label-caps uppercase text-on-surface-variant hover:bg-surface-container transition-colors">Available</button>
          <button className="px-lg py-sm rounded-lg font-label-caps text-label-caps uppercase text-on-surface-variant hover:bg-surface-container transition-colors">Suspended</button>
          <button className="px-lg py-sm rounded-lg font-label-caps text-label-caps uppercase text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-2">
            Expired
            <span className="w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>

        <div className="flex gap-md ml-auto">
          <button className="flex items-center gap-2 px-lg py-2 border border-outline-variant rounded-lg font-body-sm font-semibold hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Advanced Filters
          </button>
          <button className="flex items-center gap-2 px-lg py-2 bg-primary text-on-primary rounded-lg font-body-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Driver
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">Driver Name</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">Status</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">Assigned Vehicle</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">License Expiry</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">Safety Score</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">Performance</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline">person</span>
                      </div>
                      <div>
                        <p className="font-body-md font-bold text-on-surface">{driver.name}</p>
                        <p className="font-body-sm text-outline">ID: {driver.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <StatusBadge status={driver.status} />
                  </td>
                  <td className="px-lg py-md">
                    {driver.vehicle ? (
                      <div>
                        <p className="font-body-md font-medium">{driver.vehicle.split(' (')[0]}</p>
                        <p className="font-body-sm text-outline">Plate: {driver.vehicle.split('(')[1]?.replace(')', '') || 'N/A'}</p>
                      </div>
                    ) : (
                      <p className="font-body-md text-outline italic">Not Assigned</p>
                    )}
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-2">
                      <span className="font-body-md text-body-md">{driver.licenseExpiry}</span>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-2">
                      <span className={`font-kpi-md ${driver.safetyScore >= 90 ? 'text-primary' : driver.safetyScore >= 70 ? 'text-secondary' : 'text-error'}`}>
                        {driver.safetyScore}
                      </span>
                      <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full ${driver.safetyScore >= 90 ? 'bg-primary' : driver.safetyScore >= 70 ? 'bg-secondary' : 'bg-error'}`} style={{ width: `${driver.safetyScore}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold text-outline">
                        <span>Efficiency</span>
                        <span>{driver.efficiency}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full ${driver.efficiency >= 90 ? 'bg-primary' : driver.efficiency >= 70 ? 'bg-secondary' : 'bg-error'}`} style={{ width: `${driver.efficiency}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md text-right">
                    <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">more_vert</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-lg py-md bg-surface-container-low/30 border-t border-outline-variant/20 flex items-center justify-between">
          <p className="font-body-sm text-outline">Showing <span className="font-bold text-on-surface">1-4</span> of <span className="font-bold text-on-surface">1,284</span> drivers</p>
          <div className="flex gap-2">
            <button className="p-1 border border-outline-variant rounded-md hover:bg-white transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-on-primary font-bold text-body-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white border border-transparent hover:border-outline-variant transition-all font-medium text-body-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white border border-transparent hover:border-outline-variant transition-all font-medium text-body-sm">3</button>
            <button className="p-1 border border-outline-variant rounded-md hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverList;