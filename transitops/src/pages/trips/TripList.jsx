import React, { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import { SearchInput } from '../../components/ui/FilterBar';

export const TripList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const trips = [
    { id: 'TR-88219', origin: 'Berlin, DE', destination: 'Paris, FR', route: '680km via A2', vehicle: 'Volvo FH16 (EV)', driver: 'Marcus Schmidt', status: 'On Going', cargo: '18,400 kg', revenue: '€4,240.00' },
    { id: 'TR-88220', origin: 'Antwerp, BE', destination: 'Madrid, ES', route: '1,450km via A10', vehicle: 'Scania R450', driver: 'Lukas Bakos', status: 'Dispatched', cargo: '22,150 kg', revenue: '€6,890.50' },
    { id: 'TR-88218', origin: 'Rotterdam, NL', destination: 'Prague, CZ', route: '850km via A15', vehicle: 'Mercedes Actros', driver: 'Elena Rossi', status: 'Completed', cargo: '12,000 kg', revenue: '€2,110.00' },
    { id: 'TR-88225', origin: 'Munich, DE', destination: 'Zurich, CH', route: '315km via A96', vehicle: '---', driver: 'Unassigned', status: 'Draft', cargo: '5,400 kg', revenue: '€1,200.00' },
  ];

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Trip Dispatch</h2>
          <p className="text-on-surface-variant font-body-md mt-xs">Real-time management and optimization of active freight routes.</p>
        </div>
        <button className="bg-primary hover:bg-primary-container text-white font-headline-sm text-headline-sm px-xl py-md rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Create Trip
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="bg-white p-lg rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div>
            <h4 className="font-label-caps text-label-caps text-outline mb-sm">Fleet Efficiency</h4>
            <p className="font-kpi-lg text-kpi-lg text-on-background">94.2%</p>
          </div>
          <div className="mt-md flex items-center gap-sm">
            <span className="text-primary font-bold flex items-center text-body-sm">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +2.1%
            </span>
            <span className="text-outline text-body-sm">vs last week</span>
          </div>
        </div>
        <div className="bg-white p-lg rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div>
            <h4 className="font-label-caps text-label-caps text-outline mb-sm">Revenue Today</h4>
            <p className="font-kpi-lg text-kpi-lg text-on-background">€24,402</p>
          </div>
          <div className="mt-md flex items-center gap-sm">
            <span className="text-primary font-bold flex items-center text-body-sm">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +8.4%
            </span>
            <span className="text-outline text-body-sm">target pace</span>
          </div>
        </div>
        <div className="bg-white p-lg rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div>
            <h4 className="font-label-caps text-label-caps text-outline mb-sm">Active Driver Count</h4>
            <p className="font-kpi-lg text-kpi-lg text-on-background">112 / 128</p>
          </div>
          <div className="mt-md w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full" style={{ width: '87%' }}></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-lg mb-lg flex flex-wrap items-center gap-lg border border-surface-container">
        <div className="flex-1 min-w-[240px]">
          <label className="block font-label-caps text-label-caps text-outline mb-xs">Search Trips</label>
          <SearchInput placeholder="ID, Driver, or Destination..." value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="w-full sm:w-48">
          <label className="block font-label-caps text-label-caps text-outline mb-xs">Status</label>
          <select className="w-full border-outline-variant rounded-lg py-sm text-body-md focus:border-primary focus:ring-primary">
            <option>All Statuses</option>
            <option>Draft</option>
            <option>Dispatched</option>
            <option>On Going</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="w-full sm:w-48">
          <label className="block font-label-caps text-label-caps text-outline mb-xs">Region</label>
          <select className="w-full border-outline-variant rounded-lg py-sm text-body-md focus:border-primary focus:ring-primary">
            <option>All Regions</option>
            <option>North America</option>
            <option>Western Europe</option>
            <option>APAC</option>
            <option>LATAM</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container">
                <th className="px-lg py-md font-label-caps text-label-caps text-outline">Trip ID</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline">Route</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline">Vehicle</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline">Driver</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline">Status</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline">Cargo Weight</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline text-right">Revenue</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-lg py-md font-bold text-primary">{trip.id}</td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-sm">
                      <span className="font-body-md font-bold">{trip.origin}</span>
                      <span className="material-symbols-outlined text-[16px] text-outline">arrow_forward</span>
                      <span className="font-body-md font-bold">{trip.destination}</span>
                    </div>
                    <p className="text-body-sm text-outline mt-xs">{trip.route}</p>
                  </td>
                  <td className="px-lg py-md font-body-md">{trip.vehicle}</td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-sm">
                      <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">
                        {trip.driver.charAt(0)}
                      </div>
                      <span className="font-body-md">{trip.driver}</span>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <StatusBadge status={trip.status} />
                  </td>
                  <td className="px-lg py-md font-body-md">{trip.cargo}</td>
                  <td className="px-lg py-md font-bold text-right text-on-surface">{trip.revenue}</td>
                  <td className="px-lg py-md">
                    <div className="flex items-center justify-center gap-sm">
                      <button className="p-sm hover:bg-surface-container rounded-lg text-outline-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button className="p-sm hover:bg-surface-container rounded-lg text-outline-variant hover:text-secondary transition-colors">
                        <span className="material-symbols-outlined">edit_note</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-surface-container-low px-lg py-md flex items-center justify-between border-t border-surface-container">
          <p className="font-body-sm text-outline">Showing <span className="font-bold text-on-surface">1 - 4</span> of <span className="font-bold text-on-surface">156</span> trips</p>
          <div className="flex items-center gap-base">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-white disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-body-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-white font-body-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-white font-body-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-white">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripList;