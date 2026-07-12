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
        <div className="grid grid-cols-2 gap-md sm:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-surface-container-high/60 p-md"
            >
              <div className="mb-2 h-3 w-20 rounded bg-outline-variant/30" />
              <div className="h-8 w-16 rounded bg-outline-variant/30" />
            </div>
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl bg-surface-container-high/60" />
      </div>
    );
  }

  if (!stats) {
    return <EmptyState message="Could not load dashboard data. Check your connection." />;
  }

  const kpis = [
    {
      label: 'Active Vehicles',
      value: (stats.activeVehicles ?? 0).toLocaleString(),
      valueClass: 'text-primary',
      trend: stats.activeVehicleTrend,
      trendClass: 'text-primary',
      trendIcon: 'trending_up',
    },
    {
      label: 'Available',
      value: (stats.availableVehicles ?? 0).toLocaleString(),
      valueClass: 'text-on-surface',
      sub: `${Math.round(((stats.availableVehicles ?? 0) / (stats.totalVehicles || 1)) * 100)}% of Total Fleet`,
      subClass: 'text-outline',
    },
    {
      label: 'In Maintenance',
      value: (stats.vehiclesInMaintenance ?? 0).toLocaleString(),
      valueClass: 'text-error',
      bgClass: 'bg-error-container/30 border border-error/10',
      sub: 'Critical Level',
      subClass: 'text-error',
      subIcon: 'warning',
    },
    {
      label: 'Drivers On Trip',
      value: (stats.driversOnTrip ?? 0).toLocaleString(),
      valueClass: 'text-on-surface',
      sub: 'Optimized',
      subClass: 'text-primary',
      subIcon: 'check_circle',
    },
    {
      label: 'Pending Trips',
      value: (stats.pendingTrips ?? 0).toLocaleString(),
      valueClass: 'text-secondary',
      sub: 'Avg 12m delay',
      subClass: 'text-secondary',
      subIcon: 'schedule',
    },
    {
      label: 'Revenue',
      value: `$${(stats.revenue ?? 0).toLocaleString()}`,
      valueClass: 'text-primary',
      trend: '14% MoM',
      trendClass: 'text-primary',
      trendIcon: 'trending_up',
    },
    {
      label: 'Expenses',
      value: `$${(stats.expenses ?? 0).toLocaleString()}`,
      valueClass: 'text-on-surface',
      sub: 'Fuel Spike',
      subClass: 'text-error',
      subIcon: 'trending_up',
    },
    {
      label: 'Fleet Utilization',
      value: `${stats.fleetUtilization ?? 0}%`,
      valueClass: 'text-on-primary',
      bgClass: 'bg-primary-container p-md rounded-xl shadow-md border border-primary',
      labelClass: 'text-primary-fixed',
      target: stats.targetUtilization,
    },
  ];

  const trendData = stats.utilizationTrend?.length
    ? stats.utilizationTrend
    : [55, 60, 70, 82, 90, 78, 65];

  const barData = [
    { rev: 60, exp: 30 },
    { rev: 75, exp: 40 },
    { rev: 55, exp: 35 },
    { rev: 85, exp: 50 },
    { rev: 92, exp: 45 },
    { rev: 70, exp: 38 },
  ];

  return (
    <div className="space-y-lg">
      {/* KPI Row (Bento Grid Style) */}
      <div className="grid grid-cols-2 gap-md sm:grid-cols-4 lg:grid-cols-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={
              kpi.bgClass ||
              'bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20'
            }
          >
            <p
              className={`text-label-caps font-label-caps uppercase ${
                kpi.labelClass || 'text-on-surface-variant'
              }`}
            >
              {kpi.label}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className={`font-kpi-lg text-kpi-lg ${kpi.valueClass}`}>
                {kpi.value}
              </p>
            </div>
            {kpi.trend && (
              <div
                className={`mt-2 text-[10px] flex items-center font-bold ${kpi.trendClass}`}
              >
                <span className="material-symbols-outlined !text-[14px]">
                  {kpi.trendIcon}
                </span>{' '}
                {kpi.trend}
              </div>
            )}
            {kpi.sub && (
              <div
                className={`mt-2 text-[10px] flex items-center font-bold ${kpi.subClass}`}
              >
                {kpi.subIcon && (
                  <span className="material-symbols-outlined !text-[14px]">
                    {kpi.subIcon}
                  </span>
                )}{' '}
                {kpi.sub}
              </div>
            )}
            {kpi.target && (
              <div className="mt-2 text-[10px] text-on-primary-container flex items-center font-bold bg-primary/20 px-1 rounded">
                Target: {kpi.target}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* Fleet Utilization Trend */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/20">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-sm text-headline-sm">
              Fleet Utilization Trend
            </h3>
            <div className="flex gap-2">
              <select className="text-xs border-none bg-surface-container-low rounded-lg py-1 px-3 focus:ring-0">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
          </div>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between px-2 pt-8">
              {trendData.map((val, i) => (
                <div
                  key={i}
                  className={`w-10 rounded-t cursor-pointer transition-all ${
                    i === 4
                      ? 'bg-primary/60 border-t-2 border-primary hover:bg-primary/30'
                      : `bg-primary/${Math.max(10, val - 30)} hover:bg-primary/30`
                  }`}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
            <div className="absolute bottom-[-1.5rem] w-full flex justify-between px-2 text-[10px] font-bold text-outline uppercase tracking-wider">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Vehicle Status Donut */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/20">
          <h3 className="font-headline-sm text-headline-sm mb-lg">
            Vehicle Status
          </h3>
          <div className="relative h-64 flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 192 192">
              <circle
                cx="96" cy="96" r="80"
                fill="transparent" stroke="#f2f4f0" strokeWidth="20"
              />
              <circle
                cx="96" cy="96" r="80"
                fill="transparent" stroke="#2d6a4f"
                strokeDasharray="502" strokeDashoffset="100" strokeWidth="20"
              />
              <circle
                cx="96" cy="96" r="80"
                fill="transparent" stroke="#fdb96c"
                strokeDasharray="502" strokeDashoffset="400" strokeWidth="20"
              />
              <circle
                cx="96" cy="96" r="80"
                fill="transparent" stroke="#ba1a1a"
                strokeDasharray="502" strokeDashoffset="480" strokeWidth="20"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-kpi-lg">
                {stats.totalVehicles ?? 0}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Total Fleet
              </span>
            </div>
          </div>
          <div className="mt-lg space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" /> Active
              </div>
              <span className="font-bold">
                {stats.activeVehicles ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary-container" />{' '}
                Idle
              </div>
              <span className="font-bold">{stats.idleVehicles ?? 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-error" /> Maintenance
              </div>
              <span className="font-bold">
                {stats.vehiclesInMaintenance ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue vs Expense Grouped Bar */}
        <div className="col-span-1 md:col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/20">
          <h3 className="font-headline-sm text-headline-sm mb-lg">
            Revenue vs Expense
          </h3>
          <div className="h-64 flex items-end gap-md px-md">
            {barData.map((bar, i) => (
              <div key={i} className="flex-1 flex items-end gap-1">
                <div
                  className="w-full bg-primary-container rounded-t"
                  style={{ height: `${bar.rev}%` }}
                />
                <div
                  className="w-full bg-outline-variant rounded-t"
                  style={{ height: `${bar.exp}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-6 justify-center">
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <div className="w-3 h-3 rounded bg-primary-container" /> REVENUE
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <div className="w-3 h-3 rounded bg-outline-variant" /> EXPENSES
            </div>
          </div>
        </div>

        {/* Fuel Consumption */}
        <div className="col-span-1 md:col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/20">
          <h3 className="font-headline-sm text-headline-sm mb-lg">
            Fuel Consumption (Gal)
          </h3>
          <div className="h-64 relative bg-surface-container-low rounded-lg overflow-hidden">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M 0 80 Q 20 60, 40 70 T 80 30 T 100 40"
                fill="none"
                stroke="#2d6a4f"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx="80" cy="30" fill="#2d6a4f" r="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="absolute top-4 right-4 bg-primary text-on-primary text-[10px] px-2 py-1 rounded font-bold">
              Today: 4.2k Gal
            </div>
          </div>
        </div>
      </div>

      {/* Data & Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* Recent Trips Table */}
        <div className="col-span-1 md:col-span-12 xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="px-lg py-md border-b border-outline-variant/30 flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm">
              Recent Dispatch Trips
            </h3>
            <button className="text-primary text-xs font-bold hover:underline">
              View All
            </button>
          </div>
          {stats.recentTrips?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-lg py-sm text-label-caps font-label-caps text-on-surface-variant uppercase">
                      Trip ID
                    </th>
                    <th className="px-lg py-sm text-label-caps font-label-caps text-on-surface-variant uppercase">
                      Driver
                    </th>
                    <th className="px-lg py-sm text-label-caps font-label-caps text-on-surface-variant uppercase">
                      Route
                    </th>
                    <th className="px-lg py-sm text-label-caps font-label-caps text-on-surface-variant uppercase">
                      Status
                    </th>
                    <th className="px-lg py-sm text-label-caps font-label-caps text-on-surface-variant uppercase">
                      ETA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {stats.recentTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-surface-container-low/30 transition-colors"
                    >
                      <td className="px-lg py-md font-bold text-xs">
                        {trip.id}
                      </td>
                      <td className="px-lg py-md text-xs">{trip.driver}</td>
                      <td className="px-lg py-md text-xs">{trip.route}</td>
                      <td className="px-lg py-md">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            trip.status === 'On Trip'
                              ? 'bg-primary-fixed-dim/30 text-on-primary-fixed-variant'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-lg py-md text-xs font-medium">
                        {trip.eta || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No recent trips available." />
          )}
        </div>

        {/* Right Sidebar Column: Alerts */}
        <div className="col-span-1 md:col-span-12 xl:col-span-4 space-y-lg">
          {/* Critical Alerts */}
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/20">
            <h3 className="font-headline-sm text-headline-sm mb-md flex items-center gap-2">
              <span className="material-symbols-outlined text-error">
                warning
              </span>
              Critical Alerts
            </h3>
            {stats.criticalAlerts?.length ? (
              <div className="space-y-3">
                {stats.criticalAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border flex gap-3 items-start ${
                      alert.severity === 'error'
                        ? 'bg-error-container/20 border-error/10'
                        : 'bg-secondary-container/10 border-secondary/10'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        alert.severity === 'error'
                          ? 'bg-error/10 text-error'
                          : 'bg-secondary/10 text-secondary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-error !text-[18px]">
                        {alert.icon || 'build'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        {alert.title}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {alert.description}
                      </p>
                      {alert.time && (
                        <p
                          className={`mt-1 text-[10px] font-bold uppercase ${
                            alert.severity === 'error'
                              ? 'text-error'
                              : 'text-secondary'
                          }`}
                        >
                          {alert.time}
                          {alert.severity === 'error' ? ' • Critical' : ''}
                        </p>
                      )}
                      <div className="mt-2 flex gap-2">
                        <button
                          className={`text-[10px] font-bold uppercase hover:underline ${
                            alert.severity === 'error'
                              ? 'text-error'
                              : 'text-secondary'
                          }`}
                        >
                          {alert.severity === 'error'
                            ? 'Assign Tech'
                            : 'Send Reminders'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-error-container/20 rounded-lg border border-error/10 flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-error !text-[18px]">
                      build
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">
                      Engine Fault: Bus #402
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      Immediate attention required. Sensor failure.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button className="text-[10px] font-bold text-error uppercase hover:underline">
                        Assign Tech
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-secondary-container/10 rounded-lg border border-secondary/10 flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary !text-[18px]">
                      badge
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">
                      License Expiry: 12 Drivers
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      Renewals due within 7 days for Region A team.
                    </p>
                    <button className="mt-2 text-[10px] font-bold text-secondary uppercase hover:underline">
                      Send Reminders
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/20">
            <h3 className="font-headline-sm text-headline-sm mb-md">
              Dispatch Feed
            </h3>
            <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30">
              {(stats.dispatchFeed?.length
                ? stats.dispatchFeed
                : [
                    {
                      icon: 'local_shipping',
                      bg: 'bg-primary',
                      title: 'New Trip Dispatched',
                      desc: 'TR-9950 assigned to Driver John Doe',
                      time: '2 Minutes Ago',
                    },
                    {
                      icon: 'notifications_active',
                      bg: 'bg-secondary',
                      title: 'Route Alert: Traffic Delay',
                      desc: 'High congestion on I-95 North affecting 4 units.',
                      time: '15 Minutes Ago',
                    },
                    {
                      icon: 'check',
                      bg: 'bg-tertiary',
                      title: 'Fuel Entry Recorded',
                      desc: 'Vehicle #210 refueled: 45 Gal Diesel.',
                      time: '1 Hour Ago',
                    },
                  ]).map((item, i) => (
                <div key={i} className="relative pl-10">
                  <div
                    className={`absolute left-0 top-1 w-6 h-6 rounded-full ${item.bg} flex items-center justify-center border-4 border-surface-container-lowest`}
                  >
                    <span className="material-symbols-outlined text-on-primary !text-[12px]">
                      {item.icon}
                    </span>
                  </div>
                  <p className="text-xs font-bold">{item.title}</p>
                  <p className="text-[10px] text-on-surface-variant">
                    {item.desc}
                  </p>
                  <span className="text-[9px] text-outline font-medium uppercase mt-1 inline-block">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Floating UI */}
      <div className="fixed bottom-lg right-lg flex flex-col gap-3 items-end pointer-events-none z-50">
        <div
          className="flex flex-col gap-3 pointer-events-auto transition-all duration-300 transform translate-y-4 opacity-0 scale-95 origin-bottom"
          id="fab-menu"
        >
          <button
            className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 shadow-lg px-4 py-3 rounded-xl hover:bg-surface-container transition-all"
            title="Maintenance"
          >
            <span className="text-body-sm font-bold">Log Maintenance</span>
            <span className="material-symbols-outlined text-primary">build</span>
          </button>
          <button
            className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 shadow-lg px-4 py-3 rounded-xl hover:bg-surface-container transition-all"
            title="Fuel Entry"
          >
            <span className="text-body-sm font-bold">Fuel Entry</span>
            <span className="material-symbols-outlined text-primary">
              local_gas_station
            </span>
          </button>
          <button
            className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 shadow-lg px-4 py-3 rounded-xl hover:bg-surface-container transition-all"
            title="Dispatch Trip"
          >
            <span className="text-body-sm font-bold">Dispatch Trip</span>
            <span className="material-symbols-outlined text-primary">send</span>
          </button>
        </div>
        <button
          className="pointer-events-auto bg-primary w-14 h-14 rounded-full shadow-xl text-on-primary flex items-center justify-center hover:bg-primary-container transition-all active:scale-90 z-50"
          id="main-fab"
          onClick={() => {
            const menu = document.getElementById('fab-menu');
            const icon = document.getElementById('fab-icon');
            if (!menu || !icon) return;
            const hidden = menu.classList.contains('opacity-0');
            if (hidden) {
              menu.classList.remove('opacity-0', 'translate-y-4', 'scale-95');
              menu.classList.add('opacity-100', 'translate-y-0', 'scale-100');
              icon.innerText = 'close';
            } else {
              menu.classList.add('opacity-0', 'translate-y-4', 'scale-95');
              menu.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
              icon.innerText = 'add';
            }
          }}
        >
          <span className="material-symbols-outlined !text-[28px]" id="fab-icon">
            add
          </span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
