import React, { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';

export const ExpenseLedger = () => {
  // Mock data
  const expenses = [
    { id: '#EXP-44921', vehicle: 'Transit-8820', type: 'Diesel-Box', category: 'Fuel', description: 'Monthly refuel - Route 11B', date: 'Oct 24, 2023', vendor: 'Shell Energy', amount: '$1,422.00', status: 'Approved' },
    { id: '#EXP-44919', vehicle: 'Sprinter-441', type: 'Light-Duty', category: 'Repair', description: 'Front brake pad replacement', date: 'Oct 22, 2023', vendor: 'QuickAuto Inc.', amount: '$850.50', status: 'Pending' },
    { id: '#EXP-44915', vehicle: 'Cargo-902', type: 'Heavy-Duty', category: 'Insurance', description: 'Annual liability renewal', date: 'Oct 20, 2023', vendor: 'MetraSafe Group', amount: '$4,200.00', status: 'Approved' },
    { id: '#EXP-44910', vehicle: 'Transit-8820', type: 'Diesel-Box', category: 'Toll', description: 'Route 95 bridge tolls', date: 'Oct 18, 2023', vendor: 'EZ-Pass Dept', amount: '$145.00', status: 'Approved' },
    { id: '#EXP-44908', vehicle: 'Sprinter-441', type: 'Light-Duty', category: 'Other', description: 'Unidentified cleaning fee', date: 'Oct 17, 2023', vendor: 'EcoWash Depot', amount: '$65.00', status: 'Flagged' },
  ];

  const categoryIcons = {
    Fuel: 'local_gas_station',
    Repair: 'build',
    Insurance: 'verified_user',
    Toll: 'toll',
    Other: 'error_outline',
  };

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Expense Management</h2>
          <p className="text-on-surface-variant mt-1">Review, categorize, and approve operational expenditures across the fleet.</p>
        </div>
        <button className="bg-primary-container text-white py-2.5 px-6 rounded-lg font-body-md text-body-md flex items-center gap-sm shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all">
          <span className="material-symbols-outlined">receipt_long</span>
          <span>Add Expense</span>
        </button>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-12 gap-lg mb-xl">
        <div className="col-span-8 bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-container">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Top Expense Categories</h3>
            <div className="flex gap-sm">
              <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full font-label-caps text-label-caps">This Month</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-lg">
            {[
              { name: 'Fuel', icon: 'local_gas_station', amount: '$42.8k', trend: '+8.2%', trendType: 'up' },
              { name: 'Repairs', icon: 'build', amount: '$18.4k', trend: '-4.1%', trendType: 'down' },
              { name: 'Insurance', icon: 'verified_user', amount: '$12.1k', trend: 'Steady', trendType: 'neutral' },
              { name: 'Tolls', icon: 'toll', amount: '$6.5k', trend: '-12.0%', trendType: 'down' },
            ].map((cat) => (
              <div key={cat.name} className="space-y-sm">
                <div className="flex items-center gap-sm">
                  <div className={`p-2 rounded-lg ${
                    cat.name === 'Fuel' ? 'bg-primary/10 text-primary' :
                    cat.name === 'Repairs' ? 'bg-secondary-container/20 text-on-secondary-container' :
                    cat.name === 'Insurance' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                    'bg-surface-variant text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                  </div>
                  <span className="font-body-sm text-on-surface-variant">{cat.name}</span>
                </div>
                <div className="font-kpi-lg text-kpi-lg text-on-surface">{cat.amount}</div>
                <div className={`flex items-center text-body-sm ${
                  cat.trendType === 'up' ? 'text-error' :
                  cat.trendType === 'down' ? 'text-primary' :
                  'text-on-surface-variant'
                }`}>
                  {cat.trendType !== 'neutral' && (
                    <span className="material-symbols-outlined text-sm">{cat.trendType === 'up' ? 'trending_up' : 'trending_down'}</span>
                  )}
                  {cat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-4 bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-container">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Vehicle Cost Leaders</h3>
          <div className="space-y-md">
            {[
              { id: 'TX1', name: 'Transit-8820', cost: '$8,420', percent: 85 },
              { id: 'TX9', name: 'Sprinter-441', cost: '$6,110', percent: 60 },
              { id: 'AX4', name: 'Cargo-902', cost: '$4,900', percent: 45 },
            ].map((v) => (
              <div key={v.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-md">
                    <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center font-bold text-primary font-body-sm">{v.id}</div>
                    <span className="font-body-md font-medium">{v.name}</span>
                  </div>
                  <span className="font-kpi-md text-kpi-md">{v.cost}</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${v.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-low rounded-xl p-md mb-lg flex flex-wrap items-center gap-lg border border-outline-variant/30">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Filters</span>
        </div>
        <div className="h-8 w-px bg-outline-variant"></div>
        <select className="bg-transparent border-none p-0 text-body-sm font-medium focus:ring-0 cursor-pointer text-primary">
          <option>All Categories</option>
          <option>Insurance</option>
          <option>Parking</option>
          <option>Toll</option>
          <option>Repair</option>
          <option>Fuel</option>
          <option>Other</option>
        </select>
        <div className="flex items-center gap-sm cursor-pointer hover:text-primary transition-colors">
          <span className="text-body-sm font-medium">Oct 1 - Oct 31, 2023</span>
          <span className="material-symbols-outlined text-sm">calendar_month</span>
        </div>
        <select className="bg-transparent border-none p-0 text-body-sm font-medium focus:ring-0 cursor-pointer text-primary">
          <option>All Vehicles</option>
        </select>
        <div className="ml-auto flex gap-md">
          <button className="flex items-center gap-sm px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface-variant font-body-sm hover:bg-surface-variant transition-all">
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV
          </button>
          <button className="text-primary font-body-sm font-medium hover:underline">Clear All</button>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low z-10">
              <tr>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Expense ID</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Vehicle</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Category</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Description</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Vendor</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Amount</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">Receipt</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-lg py-md font-body-sm text-on-surface font-medium">{expense.id}</td>
                  <td className="px-lg py-md">
                    <div className="flex flex-col">
                      <span className="font-body-md font-medium text-on-surface">{expense.vehicle}</span>
                      <span className="text-[10px] text-outline font-label-caps uppercase">{expense.type}</span>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-sm">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        expense.category === 'Fuel' ? 'bg-primary/10 text-primary' :
                        expense.category === 'Repair' ? 'bg-secondary-container/20 text-on-secondary-container' :
                        expense.category === 'Insurance' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                        expense.category === 'Toll' ? 'bg-surface-variant text-on-surface-variant' :
                        'bg-error-container text-on-error-container'
                      }`}>
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{categoryIcons[expense.category]}</span>
                      </div>
                      <span className="font-body-sm text-on-surface">{expense.category}</span>
                    </div>
                  </td>
                  <td className="px-lg py-md font-body-sm text-on-surface-variant max-w-[180px] truncate">{expense.description}</td>
                  <td className="px-lg py-md font-body-sm text-on-surface-variant">{expense.date}</td>
                  <td className="px-lg py-md font-body-sm text-on-surface">{expense.vendor}</td>
                  <td className="px-lg py-md font-kpi-md text-on-surface">{expense.amount}</td>
                  <td className="px-lg py-md text-center">
                    <button className="text-primary hover:bg-primary/10 p-1.5 rounded transition-all">
                      <span className="material-symbols-outlined text-lg">attachment</span>
                    </button>
                  </td>
                  <td className="px-lg py-md">
                    <StatusBadge status={expense.status} />
                  </td>
                  <td className="px-lg py-md text-right">
                    <button className="text-outline hover:text-primary transition-all">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-lg py-md bg-surface-container-low flex justify-between items-center border-t border-surface-container">
          <span className="font-body-sm text-on-surface-variant">Showing 1-10 of 128 entries</span>
          <div className="flex gap-sm">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:border-primary hover:text-primary transition-all">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-body-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant font-body-sm hover:border-primary hover:text-primary">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant font-body-sm hover:border-primary hover:text-primary">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:border-primary hover:text-primary transition-all">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseLedger;