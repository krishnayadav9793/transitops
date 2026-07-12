import React, { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';

export const MaintenanceLogs = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const maintenanceTasks = [
    { id: 'TX-2024-429', vehicle: 'Mercedes Citaro G', service: 'Engine Repair (Hybrid Sys)', mechanic: 'Aris Petrov', date: 'Oct 12, 2023', priority: 'High', status: 'In Progress', cost: '$2,450.00' },
    { id: 'EV-9921-X', vehicle: 'BYD K9 Electric', service: 'Routine Inspection', mechanic: 'Sarah Jenkins', date: 'Oct 14, 2023', priority: 'Scheduled', status: 'Pending', cost: '$420.00' },
    { id: 'TX-2024-112', vehicle: 'Volvo 7900', service: 'Brake Replacement', mechanic: null, date: 'Oct 13, 2023', priority: 'Urgent', status: 'Delayed', cost: '$1,150.00' },
    { id: 'TX-2024-009', vehicle: 'Scania Interlink', service: 'Full Service / Oil Change', mechanic: 'Robert King', date: 'Oct 10, 2023', priority: 'Routine', status: 'Completed', cost: '$890.00' },
  ];

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Maintenance Operations</h2>
          <div className="flex items-center gap-md mt-xs">
            <div className="flex items-center gap-xs text-primary font-medium text-body-sm">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              14 Active Jobs
            </div>
            <div className="text-outline-variant text-body-sm">•</div>
            <div className="text-on-surface-variant text-body-sm">Last update: 4 mins ago</div>
          </div>
        </div>
        <div className="flex items-center gap-md w-full lg:w-auto">
          <button className="flex-1 lg:flex-none px-lg py-md border border-outline-variant rounded-lg bg-surface text-on-surface font-semibold text-body-md flex items-center justify-center gap-sm hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Advanced Filters
          </button>
          <button className="flex-1 lg:flex-none px-lg py-md bg-primary-container text-on-primary-container rounded-lg font-bold text-body-md flex items-center justify-center gap-sm shadow-md hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            Schedule Maintenance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-sm">Fleet Availability</p>
          <div className="flex justify-between items-end">
            <p className="font-kpi-lg text-kpi-lg text-on-surface">94.2%</p>
            <span className="text-primary text-body-sm font-bold flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> 1.2%
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-sm">Avg. Repair Time</p>
          <div className="flex justify-between items-end">
            <p className="font-kpi-lg text-kpi-lg text-on-surface">5.4h</p>
            <span className="text-secondary text-body-sm font-bold flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-[16px]">trending_down</span> 0.8h
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-sm">Pending Requests</p>
          <div className="flex justify-between items-end">
            <p className="font-kpi-lg text-kpi-lg text-on-surface">28</p>
            <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold mb-1">HIGH</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-sm">Budget Utilization</p>
          <div className="flex justify-between items-end">
            <p className="font-kpi-lg text-kpi-lg text-on-surface">68%</p>
            <div className="w-24 h-2 bg-surface-variant rounded-full mb-2 overflow-hidden">
              <div className="bg-primary h-full w-[68%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="flex flex-col xl:flex-row gap-xl items-start">
        {/* Table Section */}
        <div className="flex-1 w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-lg border-b border-outline-variant/30 flex flex-wrap gap-md items-center justify-between">
            <div className="flex gap-md overflow-x-auto pb-xs lg:pb-0">
              {['All Tasks', 'Pending', 'Active', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                  className={`px-md py-sm rounded-full text-body-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.toLowerCase().split(' ')[0]
                      ? 'bg-primary text-on-primary'
                      : 'hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-sm">
              <span className="text-body-sm text-outline-variant">Sort by:</span>
              <select className="bg-transparent border-none text-body-sm font-bold text-on-surface focus:ring-0 cursor-pointer">
                <option>Priority (High-Low)</option>
                <option>Date (Newest)</option>
                <option>Cost (Highest)</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Service Type</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Assigned Mechanic</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Scheduled Date</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Cost Estimate</th>
                  <th className="px-lg py-md text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {maintenanceTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-surface-bright transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className={`w-10 h-10 rounded flex items-center justify-center text-body-sm font-bold ${
                          task.priority === 'High' ? 'bg-primary/10 text-primary' :
                          task.priority === 'Urgent' ? 'bg-error/10 text-error' :
                          'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {task.id.split('-')[1]}
                        </div>
                        <div>
                          <p className="font-body-md font-bold text-on-surface">{task.id}</p>
                          <p className="text-body-sm text-on-surface-variant">{task.vehicle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md text-body-md text-on-surface">{task.service}</td>
                    <td className="px-lg py-md">
                      {task.mechanic ? (
                        <div className="flex items-center gap-sm">
                          <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden">
                            <span className="material-symbols-outlined text-[12px]">person</span>
                          </div>
                          <span className="text-body-sm text-on-surface">{task.mechanic}</span>
                        </div>
                      ) : (
                        <span className="text-body-sm text-outline font-italic italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-lg py-md">
                      <p className="text-body-sm text-on-surface">{task.date}</p>
                      <p className={`text-[10px] font-bold ${
                        task.priority === 'High' ? 'text-error' :
                        task.priority === 'Urgent' ? 'text-error' :
                        task.priority === 'Scheduled' ? 'text-primary' :
                        'text-on-surface-variant'
                      }`}>
                        {task.priority}
                      </p>
                    </td>
                    <td className="px-lg py-md">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-lg py-md font-body-md font-bold text-on-surface">{task.cost}</td>
                    <td className="px-lg py-md text-right">
                      <button className="p-2 text-outline-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-lg bg-surface-container-low flex justify-between items-center">
            <span className="text-body-sm text-on-surface-variant">Showing 1 to 4 of 128 entries</span>
            <div className="flex gap-xs">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-body-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors text-body-sm">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors text-body-sm">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Alerts */}
        <aside className="w-full xl:w-[320px] space-y-lg">
          {/* Alert Card: Overdue */}
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-error">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                Overdue
              </h3>
              <span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">Critical</span>
            </div>
            <div className="space-y-md">
              <div className="p-sm bg-error-container/10 border border-error-container/20 rounded-lg group cursor-pointer hover:bg-error-container/20 transition-colors">
                <p className="text-body-sm font-bold text-on-surface">Vehicle TX-108</p>
                <p className="text-[11px] text-on-surface-variant">Brake wear limit exceeded</p>
                <p className="text-[10px] text-error font-bold mt-1">4 Days Overdue</p>
              </div>
              <div className="p-sm bg-error-container/10 border border-error-container/20 rounded-lg group cursor-pointer hover:bg-error-container/20 transition-colors">
                <p className="text-body-sm font-bold text-on-surface">Vehicle EV-05</p>
                <p className="text-[11px] text-on-surface-variant">Battery cooling system service</p>
                <p className="text-[10px] text-error font-bold mt-1">1 Day Overdue</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MaintenanceLogs;