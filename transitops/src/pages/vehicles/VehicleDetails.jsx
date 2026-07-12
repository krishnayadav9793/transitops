import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../../components/ui/StatusBadge';

const TABS = ['Trip History', 'Maintenance History', 'Fuel Logs', 'Expense Logs', 'Analytics', 'Documents'];

const tripHistory = [
  { id: 'TR-8821', route: 'Logistics Hub A → Central Terminal', date: 'Oct 10, 2023 · 08:30 AM', distance: '42.5 km', duration: '1h 12m', status: 'Completed' },
  { id: 'TR-8794', route: 'Central Terminal → Westside Depot', date: 'Oct 09, 2023 · 02:15 PM', distance: '12.8 km', duration: '24m', status: 'Completed' },
  { id: 'TR-8702', route: 'Logistics Hub A → East Port', date: 'Oct 08, 2023 · 06:45 AM', distance: '84.2 km', duration: '2h 05m', status: 'Delayed' },
];

const maintenanceHistory = [
  { title: 'Full Engine Diagnostic & Oil Change', date: 'Oct 24, 2023 (Scheduled)', status: 'UPCOMING', detail: 'Assigned to: Central Workshop (Mechanic: Elias Thorne)' },
  { title: 'Brake Pad Replacement (Front)', date: 'Sep 12, 2023', status: 'COMPLETED', detail: 'Cost: $420.00 · Mileage: 142,000 km' },
  { title: 'Annual Safety Inspection', date: 'Aug 05, 2023', status: 'COMPLETED', detail: 'Result: Pass · Next inspection due: Aug 2024' },
];

export const VehicleDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const vehicleInfo = [
    { label: 'Model', value: 'Mercedes-Benz Sprinter 516' },
    { label: 'VIN', value: 'W1W4632311X204188' },
    { label: 'Year', value: '2023' },
    { label: 'Color', value: 'Arctic White' },
    { label: 'Engine No', value: '651955 30 112041' },
  ];

  return (
    <div className="space-y-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center gap-xs text-on-surface-variant font-body-sm mb-xs">
            <Link to="/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary font-medium">{id || 'V-2041'}</span>
          </nav>
          <div className="flex items-center gap-md">
            <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight">{id || 'V-2041'}</h2>
            <StatusBadge status="Active" />
          </div>
        </div>
        <div className="flex gap-md">
          <button className="flex items-center gap-sm px-lg py-md bg-white border border-outline-variant text-primary font-bold rounded-lg hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined">edit</span>
            Edit Details
          </button>
          <button className="flex items-center gap-sm px-lg py-md bg-primary-container text-white font-bold rounded-lg hover:shadow-lg transition-all">
            <span className="material-symbols-outlined">description</span>
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] p-lg flex flex-col h-full border border-surface-container-highest/30">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>directions_bus</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Vehicle Information</h3>
            </div>
            <div className="space-y-md">
              {vehicleInfo.map((info) => (
                <div key={info.label} className="flex justify-between items-center py-sm border-b border-surface-container">
                  <span className="text-on-surface-variant font-body-sm uppercase tracking-wider opacity-60">{info.label}</span>
                  <span className="font-body-md font-semibold text-on-surface">{info.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-lg pt-lg border-t border-surface-container flex-1">
              <div className="w-full h-40 rounded-lg overflow-hidden bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl">directions_bus</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-lg">
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] p-lg border border-surface-container-highest/30">
            <p className="text-on-surface-variant font-label-caps mb-sm uppercase">Total Trips</p>
            <div className="flex items-baseline gap-sm">
              <span className="font-kpi-lg text-kpi-lg text-on-surface">1,284</span>
              <span className="text-primary font-body-sm font-bold flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +12%
              </span>
            </div>
            <p className="text-on-surface-variant font-body-sm mt-xs">vs. previous month</p>
          </div>
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] p-lg border border-surface-container-highest/30">
            <p className="text-on-surface-variant font-label-caps mb-sm uppercase">Fuel Efficiency</p>
            <div className="flex items-baseline gap-sm">
              <span className="font-kpi-lg text-kpi-lg text-on-surface">18.4 <span className="text-headline-sm font-medium">MPG</span></span>
              <span className="text-error font-body-sm font-bold flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                -2.1%
              </span>
            </div>
            <p className="text-on-surface-variant font-body-sm mt-xs">Target: 20.0 MPG</p>
          </div>
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] p-lg border border-surface-container-highest/30">
            <p className="text-on-surface-variant font-label-caps mb-sm uppercase">Next Maintenance</p>
            <div className="flex items-baseline gap-sm">
              <span className="font-kpi-lg text-kpi-lg text-secondary">14 <span className="text-headline-sm font-medium">Days</span></span>
            </div>
            <p className="text-on-surface-variant font-body-sm mt-xs">Due on Oct 24, 2023</p>
          </div>

          <div className="col-span-3 bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-surface-container-highest/30 overflow-hidden">
            <div className="border-b border-surface-container overflow-x-auto no-scrollbar">
              <div className="flex px-lg pt-md">
                {TABS.map((tab, idx) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(idx)}
                    className={`px-lg pb-md font-body-md whitespace-nowrap transition-colors ${
                      idx === activeTab
                        ? 'text-primary font-semibold border-b-2 border-primary'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-lg">
              {activeTab === 0 && (
                <div>
                  <div className="flex justify-between items-center mb-md">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">Recent Routes</h4>
                    <div className="flex gap-sm">
                      <button className="p-xs hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
                      <button className="p-xs hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined">download</span></button>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                        <th className="px-md py-sm rounded-l-lg">Route ID</th>
                        <th className="px-md py-sm">Origin - Destination</th>
                        <th className="px-md py-sm">Distance</th>
                        <th className="px-md py-sm">Duration</th>
                        <th className="px-md py-sm">Status</th>
                        <th className="px-md py-sm rounded-r-lg text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {tripHistory.map((trip) => (
                        <tr key={trip.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-md py-md font-kpi-md text-[14px]">{trip.id}</td>
                          <td className="px-md py-md">
                            <p className="font-body-md font-medium">{trip.route}</p>
                            <p className="text-body-sm text-on-surface-variant">{trip.date}</p>
                          </td>
                          <td className="px-md py-md font-kpi-md text-[14px]">{trip.distance}</td>
                          <td className="px-md py-md font-body-md">{trip.duration}</td>
                          <td className="px-md py-md">
                            <StatusBadge status={trip.status} />
                          </td>
                          <td className="px-md py-md text-right">
                            <button className="text-primary hover:underline font-bold text-body-sm">Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <div className="flex justify-between items-center mb-xl">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">Service Timeline</h4>
                    <button className="px-md py-sm bg-primary-container text-white font-bold rounded-lg text-body-sm">+ Schedule Service</button>
                  </div>
                  <div className="relative pl-lg border-l-2 border-surface-container ml-sm space-y-xl">
                    {maintenanceHistory.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full ring-4 ring-white ${item.status === 'UPCOMING' ? 'bg-secondary' : 'bg-primary'}`}></div>
                        <div className="bg-surface-container-low p-md rounded-lg border border-surface-container">
                          <div className="flex justify-between items-start mb-sm">
                            <div>
                              <h5 className="font-body-md font-bold text-on-surface">{item.title}</h5>
                              <p className="text-body-sm text-on-surface-variant">{item.date}</p>
                            </div>
                            <StatusBadge status={item.status} />
                          </div>
                          <p className="text-body-sm text-on-surface-variant">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(activeTab >= 2) && (
                <div className="flex items-center justify-center h-32 text-on-surface-variant">
                  <p className="font-body-md">Tab content placeholder</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-lg">
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-surface-container-highest/30 overflow-hidden">
            <div className="p-md bg-surface-container-low border-b border-surface-container flex justify-between items-center">
              <span className="font-body-md font-bold text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Live Location
              </span>
              <span className="text-body-sm text-on-surface-variant flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Live
              </span>
            </div>
            <div className="h-64 bg-surface-container flex items-center justify-center text-on-surface-variant">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl">map</span>
                <p className="font-body-sm mt-sm">Map View</p>
              </div>
            </div>
            <div className="p-md bg-white/90 flex items-center justify-between">
              <div>
                <p className="text-body-sm font-bold text-on-surface">Industrial Sector 4, Terminal C</p>
                <p className="text-body-sm text-on-surface-variant">Last updated: 2 mins ago</p>
              </div>
              <button className="p-sm bg-primary-container text-white rounded-md">
                <span className="material-symbols-outlined">near_me</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] p-lg border border-surface-container-highest/30">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Current Driver</h3>
            <div className="flex items-center gap-md">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant border-2 border-surface-container">
                <span className="material-symbols-outlined text-2xl">person</span>
              </div>
              <div>
                <h4 className="font-body-lg font-bold text-on-surface">David Chen</h4>
                <p className="text-body-sm text-on-surface-variant">Emp ID: #99283 · Class B License</p>
                <div className="flex items-center gap-xs mt-sm">
                  <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-body-sm font-bold text-on-surface">4.8</span>
                  <span className="text-body-sm text-on-surface-variant">(150+ trips)</span>
                </div>
              </div>
            </div>
            <div className="mt-lg flex gap-md">
              <button className="flex-1 py-md border border-outline-variant text-primary font-bold rounded-lg hover:bg-surface-container-low transition-all">Message</button>
              <button className="flex-1 py-md bg-white border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container-low transition-all">History</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
