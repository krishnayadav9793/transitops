import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-2xl text-center">
    <span className="material-symbols-outlined text-4xl text-outline-variant">
      database
    </span>
    <p className="mt-md font-body-md text-on-surface-variant">{message}</p>
  </div>
);

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/dashboard/stats')
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-surface-container-high/60 p-lg h-32"
            />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl bg-surface-container-high/60" />
      </div>
    );
  }

  if (!stats) {
    return <EmptyState message="Could not load dashboard data. Check your connection." />;
  }

  const total = stats.totalVehicles || 1;
  const activePercent = Math.round((stats.activeVehicles / total) * 100) || 0;
  const idlePercent = Math.round((stats.idleVehicles / total) * 100) || 0;
  const maintPercent = Math.round((stats.vehiclesInMaintenance / total) * 100) || 0;

  // SVG Circumference calculations for Donut
  const circ = 502; 
  const activeOffset = 0;
  const idleOffset = circ - (stats.activeVehicles / total) * circ;
  const maintOffset = circ - ((stats.activeVehicles + stats.idleVehicles) / total) * circ;

  const kpis = [
    {
      label: 'Active Vehicles',
      value: (stats.activeVehicles ?? 0).toLocaleString(),
      valueClass: 'text-primary',
      sub: `${activePercent}% of Fleet active`,
      subClass: 'text-primary',
      icon: 'directions_bus',
    },
    {
      label: 'Available Units',
      value: (stats.availableVehicles ?? 0).toLocaleString(),
      valueClass: 'text-on-surface',
      sub: `${stats.availableVehicles ?? 0} ready for dispatch`,
      subClass: 'text-outline',
      icon: 'check_circle',
    },
    {
      label: 'In Maintenance',
      value: (stats.vehiclesInMaintenance ?? 0).toLocaleString(),
      valueClass: 'text-error',
      bgClass: 'bg-error-container/10 border border-error/20',
      sub: `${maintPercent}% in service shop`,
      subClass: 'text-error',
      icon: 'build',
    },
    {
      label: 'Drivers On Duty',
      value: (stats.driversOnTrip ?? 0).toLocaleString(),
      valueClass: 'text-on-surface',
      sub: 'Operators on trip',
      subClass: 'text-primary',
      icon: 'person',
    },
    {
      label: 'Pending Dispatches',
      value: (stats.pendingTrips ?? 0).toLocaleString(),
      valueClass: 'text-secondary',
      sub: 'Draft trip sheets',
      subClass: 'text-secondary',
      icon: 'schedule',
    },
    {
      label: 'Operation Revenue',
      value: `$${(stats.revenue ?? 0).toLocaleString()}`,
      valueClass: 'text-primary',
      sub: 'Completed trips income',
      subClass: 'text-primary',
      icon: 'payments',
    },
    {
      label: 'Total Expenses',
      value: `$${(stats.expenses ?? 0).toLocaleString()}`,
      valueClass: 'text-on-surface',
      sub: 'Oils, fuel & repairs',
      subClass: 'text-error',
      icon: 'account_balance_wallet',
    },
    {
      label: 'Fleet Utilization',
      value: `${stats.fleetUtilization ?? 0}%`,
      valueClass: 'text-on-primary',
      bgClass: 'bg-primary text-on-primary p-lg rounded-xl shadow-md border border-primary',
      labelClass: 'text-primary-fixed-dim',
      sub: `Target limit: ${stats.targetUtilization}%`,
      subClass: 'text-primary-fixed-dim',
      icon: 'trending_up',
    },
  ];

  const trendData = stats.utilizationTrend?.length
    ? stats.utilizationTrend
    : [55, 60, 70, 82, 90, 78, 65];

  const barData = [
    { label: 'Jan', rev: 60, exp: 30 },
    { label: 'Feb', rev: 75, exp: 40 },
    { label: 'Mar', rev: 55, exp: 35 },
    { label: 'Apr', rev: 85, exp: 50 },
    { label: 'May', rev: 92, exp: 45 },
    { label: 'Jun', rev: stats.fleetUtilization || 70, exp: (stats.expenses / 1000) || 38 },
  ];

  return (
    <div className="space-y-xl">
      
      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={
              kpi.bgClass ||
              'bg-surface-container-lowest p-lg rounded-2xl shadow-sm border border-surface-container hover:shadow-md transition-shadow flex items-start justify-between'
            }
          >
            <div className="space-y-sm">
              <p
                className={`text-label-caps font-label-caps uppercase ${
                  kpi.labelClass || 'text-on-surface-variant'
                }`}
              >
                {kpi.label}
              </p>
              <p className={`font-kpi-lg text-kpi-lg ${kpi.valueClass}`}>
                {kpi.value}
              </p>
              {kpi.sub && (
                <p className={`text-[11px] font-semibold tracking-wide ${kpi.subClass}`}>
                  {kpi.sub}
                </p>
              )}
            </div>
            <div className="p-sm bg-surface-container rounded-lg text-outline-variant">
              <span className="material-symbols-outlined text-xl">{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        
        {/* Fleet Utilization Trend (Custom CSS Graph) */}
        <div className="col-span-1 lg:col-span-8 bg-surface-container-lowest rounded-2xl p-lg shadow-sm border border-surface-container">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Fleet Utilization Trend
            </h3>
            <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-caps text-label-caps">Weekly Telemetry</span>
          </div>
          <div className="h-64 relative flex items-end justify-between px-md pt-8 border-b border-outline-variant/30">
            {trendData.map((val, i) => (
              <div key={i} className="flex flex-col items-center flex-1 group">
                {/* Popover values on hover */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded text-[10px] font-bold absolute mb-2 translate-y-[-40px]">
                  {val}%
                </span>
                <div
                  className="w-8 md:w-12 rounded-t-lg transition-all duration-300 group-hover:brightness-95"
                  style={{
                    height: `${val * 2}px`,
                    backgroundColor: `rgba(15, 82, 56, ${Math.max(0.15, val / 100)})`,
                    borderTop: '2.5px solid #0f5238'
                  }}
                />
              </div>
            ))}
            
            {/* Weekdays Labels */}
            <div className="absolute bottom-[-1.75rem] w-full flex justify-between px-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              <span className="flex-1 text-center">Mon</span>
              <span className="flex-1 text-center">Tue</span>
              <span className="flex-1 text-center">Wed</span>
              <span className="flex-1 text-center">Thu</span>
              <span className="flex-1 text-center">Fri</span>
              <span className="flex-1 text-center">Sat</span>
              <span className="flex-1 text-center">Sun</span>
            </div>
          </div>
        </div>

        {/* Vehicle Status Circle Donut */}
        <div className="col-span-1 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-lg shadow-sm border border-surface-container">
          <h3 className="font-headline-sm text-headline-sm mb-lg text-on-surface">
            Vehicle Status Share
          </h3>
          <div className="relative h-56 flex items-center justify-center">
            <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 192 192">
              <circle
                cx="96" cy="96" r="80"
                fill="transparent" stroke="#f2f4f0" strokeWidth="18"
              />
              {/* Active (Green) */}
              {stats.activeVehicles > 0 && (
                <circle
                  cx="96" cy="96" r="80"
                  fill="transparent" stroke="#0f5238"
                  strokeDasharray={`${circ}`} strokeDashoffset={`${activeOffset}`} strokeWidth="18"
                  strokeLinecap="round"
                />
              )}
              {/* Idle (Orange) */}
              {stats.idleVehicles > 0 && (
                <circle
                  cx="96" cy="96" r="80"
                  fill="transparent" stroke="#fdb96c"
                  strokeDasharray={`${circ}`} strokeDashoffset={`${idleOffset}`} strokeWidth="18"
                  strokeLinecap="round"
                />
              )}
              {/* In Maintenance (Red) */}
              {stats.vehiclesInMaintenance > 0 && (
                <circle
                  cx="96" cy="96" r="80"
                  fill="transparent" stroke="#ba1a1a"
                  strokeDasharray={`${circ}`} strokeDashoffset={`${maintOffset}`} strokeWidth="18"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-kpi-lg text-on-surface">
                {stats.totalVehicles ?? 0}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Total Fleet
              </span>
            </div>
          </div>
          
          {/* Status Breakdown Legend */}
          <div className="mt-md space-y-2">
            <div className="flex justify-between items-center text-body-sm border-b border-surface-container pb-1">
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" /> Active
              </div>
              <span className="font-bold text-on-surface">{stats.activeVehicles ?? 0}</span>
            </div>
            <div className="flex justify-between items-center text-body-sm border-b border-surface-container pb-1">
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim" /> Idle / Available
              </div>
              <span className="font-bold text-on-surface">{stats.availableVehicles ?? 0}</span>
            </div>
            <div className="flex justify-between items-center text-body-sm pb-1">
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-2.5 h-2.5 rounded-full bg-error" /> Maintenance Shop
              </div>
              <span className="font-bold text-error">{stats.vehiclesInMaintenance ?? 0}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grouped Bar Graph & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        
        {/* Revenue vs Expense Grouped Chart */}
        <div className="col-span-1 lg:col-span-8 bg-surface-container-lowest rounded-2xl p-lg shadow-sm border border-surface-container">
          <h3 className="font-headline-sm text-headline-sm mb-lg text-on-surface">
            Operational Revenue vs Expense
          </h3>
          <div className="h-64 flex items-end gap-lg px-md pb-md border-b border-outline-variant/30 relative">
            {barData.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                <div className="flex items-end gap-1.5 w-full justify-center">
                  <div
                    className="w-3 md:w-5 bg-primary rounded-t-sm transition-all duration-300"
                    style={{ height: `${bar.rev * 1.8}px` }}
                    title={`Revenue: $${bar.rev}`}
                  />
                  <div
                    className="w-3 md:w-5 bg-secondary rounded-t-sm transition-all duration-300"
                    style={{ height: `${bar.exp * 1.8}px` }}
                    title={`Expenses: $${bar.exp}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-sm">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-md flex gap-lg justify-center">
            <div className="flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant">
              <div className="w-3 h-3 rounded bg-primary" /> DISPATCH REVENUE
            </div>
            <div className="flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant">
              <div className="w-3 h-3 rounded bg-secondary" /> OPERATIONS EXPENSES
            </div>
          </div>
        </div>

        {/* Activity Dispatch Feed */}
        <div className="col-span-1 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-lg shadow-sm border border-surface-container flex flex-col justify-between">
          <h3 className="font-headline-sm text-headline-sm mb-lg text-on-surface">
            Dispatch Feed
          </h3>
          <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30 flex-1">
            {[
              {
                icon: 'local_shipping',
                bg: 'bg-primary text-on-primary',
                title: 'New Trip Dispatched',
                desc: 'TRP assigned to active driver',
                time: '2 Minutes Ago',
              },
              {
                icon: 'notifications_active',
                bg: 'bg-secondary text-on-secondary',
                title: 'Odometer Sync Completed',
                desc: 'Dashboard indicators updated.',
                time: '15 Minutes Ago',
              },
              {
                icon: 'check_circle',
                bg: 'bg-primary text-on-primary',
                title: 'Maintenance Log Closed',
                desc: 'Vehicle returned to availability list.',
                time: '1 Hour Ago',
              },
            ].map((item, i) => (
              <div key={i} className="relative pl-10">
                <div
                  className={`absolute left-0 top-1 w-6 h-6 rounded-full ${item.bg} flex items-center justify-center border-4 border-surface-container-lowest`}
                >
                  <span className="material-symbols-outlined !text-[12px]">
                    {item.icon}
                  </span>
                </div>
                <p className="text-body-sm font-bold text-on-surface">{item.title}</p>
                <p className="text-[11px] text-on-surface-variant">
                  {item.desc}
                </p>
                <span className="text-[9px] text-outline font-semibold uppercase mt-1 inline-block">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
