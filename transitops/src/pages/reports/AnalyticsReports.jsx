import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

export const AnalyticsReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/dashboard/stats').catch(() => null),
      apiClient.get('/trips').catch(() => [])
    ])
      .then(([statsData, tripsData]) => {
        setStats(statsData);
        setTrips(tripsData || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-4xl text-outline-variant animate-spin">
          sync
        </span>
        <p className="mt-4 font-body-md text-on-surface-variant italic">Loading operational analytics reports...</p>
      </div>
    );
  }

  // Sizing and calculation from DB
  const totalTrips = trips.length;
  const completedTrips = trips.filter(t => t.trip_statuses?.status_name === 'COMPLETED').length;
  const activeTrips = trips.filter(t => t.trip_statuses?.status_name === 'ON_TRIP').length;
  const cancelledTrips = trips.filter(t => t.trip_statuses?.status_name === 'CANCELLED').length;
  
  const onTimeRate = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 100;

  const totalV = stats?.totalVehicles || 1;
  const activeP = stats?.totalVehicles > 0 ? Math.round((stats.activeVehicles / totalV) * 100) : 0;
  const idleP = stats?.totalVehicles > 0 ? Math.round((stats.idleVehicles / totalV) * 100) : 0;
  const maintP = stats?.totalVehicles > 0 ? Math.round((stats.vehiclesInMaintenance / totalV) * 100) : 0;

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Operational Analytics</h2>
          <p className="text-on-surface-variant mt-1">Comprehensive insights into fleet performance and operations.</p>
        </div>
        <div className="flex items-center gap-md">
          <button className="flex items-center gap-sm px-lg py-2 border border-outline-variant rounded-lg font-body-sm font-semibold hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Report
          </button>
          <button className="flex items-center gap-sm px-lg py-2 bg-primary text-on-primary rounded-lg font-body-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Generate New
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-xs sm:gap-xl border-b border-outline-variant overflow-x-auto no-scrollbar">
        {['Overview', 'Fleet Performance', 'Financial', 'Compliance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`pb-md px-base transition-colors flex items-center gap-sm ${
              activeTab === tab.toLowerCase()
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{
              tab === 'Overview' ? 'dashboard' :
              tab === 'Fleet Performance' ? 'directions_bus' :
              tab === 'Financial' ? 'payments' :
              'verified_user'
            }</span>
            <span className="font-body-md">{tab}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-sm mb-2">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Trips</span>
          </div>
          <p className="font-kpi-lg text-kpi-lg text-on-surface">{totalTrips}</p>
          <p className="text-body-sm text-primary mt-2 font-medium">{activeTrips} active dispatches</p>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-sm mb-2">
            <span className="material-symbols-outlined text-secondary">schedule</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">On-Time Rate</span>
          </div>
          <p className="font-kpi-lg text-kpi-lg text-on-surface">{onTimeRate}%</p>
          <p className="text-body-sm text-primary mt-2 font-medium">{completedTrips} completed trips</p>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-sm mb-2">
            <span className="material-symbols-outlined text-error">warning</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Cancelled Trips</span>
          </div>
          <p className="font-kpi-lg text-kpi-lg text-on-surface">{cancelledTrips}</p>
          <p className="text-body-sm text-error mt-2 font-medium">{cancelledTrips > 0 ? 'Review routing parameters' : 'Perfect dispatch rate'}</p>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-sm mb-2">
            <span className="material-symbols-outlined text-primary">payments</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Expenses</span>
          </div>
          <p className="font-kpi-lg text-kpi-lg text-on-surface">${(stats?.expenses || 0).toLocaleString()}</p>
          <p className="text-body-sm text-primary mt-2 font-medium">Logged fleet bills</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/20">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Monthly Revenue Trend</h3>
          <div className="h-64 flex items-end gap-md px-md">
            {[30, 45, 55, 65, 80, 95, 85, 75, stats?.fleetUtilization || 88, 92, 86, 98].map((val, i) => (
              <div key={i} className="flex-1 flex items-end">
                <div className="w-full bg-[#1C5B3E] rounded-t hover:bg-[#1C5B3E]/80 transition-all animate-in fade-in slide-in-from-bottom duration-500" style={{ height: `${val}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-outline uppercase tracking-wider px-md">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/20">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Fleet Distribution</h3>
          <div className="h-48 flex items-center justify-center">
            <div className="relative w-32 h-32 rounded-full border-8 border-[#1C5B3E] flex items-center justify-center">
              <div className="text-center">
                <p className="font-kpi-md text-on-surface">{activeP}%</p>
                <p className="text-xs text-on-surface-variant">Active</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#1C5B3E]"></div> Active</div>
              <span className="font-bold">{activeP}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Idle</div>
              <span className="font-bold">{idleP}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Maintenance</div>
              <span className="font-bold">{maintP}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="col-span-1 md:col-span-2 bg-primary-container p-lg rounded-xl flex items-center justify-between overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 max-w-lg">
            <h4 className="font-headline-sm text-headline-sm text-on-primary-container mb-2">Fleet Optimization AI</h4>
            <p className="font-body-sm text-on-primary-container/80 mb-4">Our AI has identified 24 more efficient route pairings for your available drivers. Implementing these could reduce fuel costs by 15% this month.</p>
            <button className="px-lg py-2 bg-on-primary-container text-primary-container rounded-lg font-bold font-body-sm hover:scale-[1.02] transition-transform">Run Optimization</button>
          </div>
          <div className="relative z-10 w-32 h-32 opacity-20">
            <span className="material-symbols-outlined text-[128px] text-on-primary-container">psychology</span>
          </div>
        </div>
        <div className="bg-secondary-container p-lg rounded-xl flex flex-col justify-center">
          <h4 className="font-label-caps text-label-caps text-on-secondary-container uppercase mb-2">Sustainability Goal</h4>
          <p className="font-kpi-md text-kpi-md text-on-secondary-container mb-4">88% EV Fleet</p>
          <div className="w-full h-2 bg-on-secondary-container/20 rounded-full overflow-hidden">
            <div className="h-full bg-on-secondary-container w-[88%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;