import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import StatusBadge from '../../components/ui/StatusBadge';
import ExpenseFormModal from './ExpenseFormModal';

const categoryIcons = {
  FUEL: 'local_gas_station',
  REPAIR: 'build',
  INSURANCE: 'verified_user',
  TOLL: 'toll',
  PARKING: 'local_parking',
  MAINTENANCE: 'engineering',
  OTHER: 'error_outline',
};

const categoryBg = {
  FUEL: 'bg-primary/10 text-primary',
  REPAIR: 'bg-secondary-container/20 text-on-secondary-container',
  INSURANCE: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  TOLL: 'bg-surface-variant text-on-surface-variant',
  PARKING: 'bg-surface-variant text-on-surface-variant',
  MAINTENANCE: 'bg-secondary-container/20 text-on-secondary-container',
  OTHER: 'bg-error-container text-on-error-container',
};

export const ExpenseLedger = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get('/expenses');
      setExpenses(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve expense ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter computation
  const filteredExpenses = expenses.filter((e) => {
    const categoryName = e.expense_categories?.category_name || 'OTHER';
    const matchesCategory = categoryFilter === 'ALL' || categoryName === categoryFilter;

    const registration = e.vehicles?.registration_number || '';
    const matchesVehicle = vehicleFilter === 'ALL' || registration === vehicleFilter;

    const query = searchQuery.toLowerCase();
    const description = e.description || '';
    const matchesSearch =
      description.toLowerCase().includes(query) ||
      categoryName.toLowerCase().includes(query) ||
      registration.toLowerCase().includes(query);

    return matchesCategory && matchesVehicle && matchesSearch;
  });

  // Calculate dynamic analytics
  const categoriesList = ['FUEL', 'REPAIR', 'INSURANCE', 'TOLL'];
  const categorySums = categoriesList.reduce((acc, cat) => {
    const sum = expenses
      .filter((e) => (e.expense_categories?.category_name || 'OTHER') === cat)
      .reduce((s, e) => s + Number(e.amount), 0);
    acc[cat] = sum;
    return acc;
  }, {});

  // Group expenses by vehicle
  const vehicleSums = expenses.reduce((acc, e) => {
    const vehicleName = e.vehicles?.vehicle_name || 'Fleet Level';
    const reg = e.vehicles?.registration_number || '';
    const label = reg ? `${vehicleName} (${reg})` : 'Fleet / General';
    acc[label] = (acc[label] || 0) + Number(e.amount);
    return acc;
  }, {});

  const sortedVehicles = Object.entries(vehicleSums)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const maxVehicleCost = sortedVehicles.length > 0 ? sortedVehicles[0][1] : 1;

  // Unique vehicles list for filter select
  const uniqueVehicles = Array.from(
    new Set(
      expenses
        .filter((e) => e.vehicles?.registration_number)
        .map((e) => e.vehicles.registration_number)
    )
  );

  // CSV Exporter Utility
  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) return alert('No expense records to export.');

    const headers = ['Expense ID', 'Vehicle Name', 'Registration Number', 'Category', 'Description', 'Date', 'Amount', 'Created By'];
    const rows = filteredExpenses.map((e) => [
      `EXP-${e.expense_id}`,
      e.vehicles?.vehicle_name || 'Fleet Level',
      e.vehicles?.registration_number || 'N/A',
      e.expense_categories?.category_name || 'OTHER',
      e.description || '',
      e.expense_date,
      Number(e.amount).toFixed(2),
      e.users?.full_name || 'System'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((val) => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TransitOps_Expense_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setVehicleFilter('ALL');
  };

  return (
    <div className="space-y-lg">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-lg mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Expense Management</h2>
          <p className="text-on-surface-variant mt-1">Review, categorize, and track operational expenditures across the fleet.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary hover:bg-primary-container text-white py-2.5 px-6 rounded-lg font-body-md text-body-md flex items-center gap-sm shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span>Add Expense</span>
        </button>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-12 gap-lg">
        
        {/* Top Expense Categories */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-container">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Top Expense Categories</h3>
            <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full font-label-caps text-label-caps">Ledger Summary</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-lg">
            {[
              { name: 'Fuel', icon: 'local_gas_station', amount: '$42.8k', trend: '+8.2%', trendType: 'up' },
              { name: 'Repairs', icon: 'build', amount: '$18.4k', trend: '-4.1%', trendType: 'down' },
              { name: 'Insurance', icon: 'verified_user', amount: '$12.1k', trend: 'Steady', trendType: 'neutral' },
              { name: 'Tolls', icon: 'toll', amount: '$6.5k', trend: '-12.0%', trendType: 'down' },
            ].map((cat) => (
              <div key={cat.name} className="space-y-sm">
                <div className="flex items-center gap-sm">
                  <div className={`p-2 rounded-lg ${categoryBg[cat] || 'bg-surface-variant text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {categoryIcons[cat] || 'receipt'}
                    </span>
                  </div>
                  <span className="font-body-sm text-on-surface-variant capitalize">{cat.toLowerCase()}</span>
                </div>
                <div className="font-kpi-lg text-kpi-lg text-on-surface">
                  ${(categorySums[cat] || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Cost Leaders */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-container">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Vehicle Cost Leaders</h3>
          <div className="space-y-md">
            {sortedVehicles.length === 0 ? (
              <p className="text-outline text-body-sm italic py-4 text-center">No vehicle cost records.</p>
            ) : (
              sortedVehicles.map(([label, cost]) => {
                const percent = maxVehicleCost > 0 ? (cost / maxVehicleCost) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body-sm font-semibold truncate max-w-[200px]">{label}</span>
                      <span className="font-kpi-md text-kpi-md">${cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-surface-container-low rounded-xl p-md flex flex-wrap items-center gap-lg border border-outline-variant/30">
        
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Filters</span>
        </div>

        <div className="h-8 w-px bg-outline-variant"></div>

        {/* Search */}
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search description..."
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-transparent border-none text-body-sm font-semibold focus:ring-0 cursor-pointer text-primary outline-none"
        >
          <option value="ALL">All Categories</option>
          {Object.keys(categoryIcons).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Vehicle Filter */}
        <select
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
          className="bg-transparent border-none text-body-sm font-semibold focus:ring-0 cursor-pointer text-primary outline-none"
        >
          <option value="ALL">All Vehicles</option>
          {uniqueVehicles.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <div className="ml-auto flex gap-md items-center">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-sm px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface-variant font-body-sm hover:bg-surface-variant transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleClearFilters}
            className="text-primary font-body-sm font-semibold hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
        {error && (
          <div className="p-md bg-error/10 text-error border-b border-error/20 font-body-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low z-10">
              <tr>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Expense ID</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Vehicle</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Category</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Description</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Recorded By</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-lg py-8 text-center text-outline italic">
                    Loading expense ledger entries...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-lg py-8 text-center text-outline italic">
                    No expense records matching search options found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => {
                  const cat = expense.expense_categories?.category_name || 'OTHER';
                  return (
                    <tr key={expense.expense_id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="px-lg py-md font-body-sm text-on-surface font-semibold">EXP-{expense.expense_id}</td>
                      <td className="px-lg py-md">
                        {expense.vehicles ? (
                          <div className="flex flex-col">
                            <span className="font-body-md font-bold text-on-surface">{expense.vehicles.vehicle_name || 'Vehicle'}</span>
                            <span className="text-[10px] text-outline font-label-caps uppercase">{expense.vehicles.registration_number}</span>
                          </div>
                        ) : (
                          <span className="font-body-sm text-outline italic">Fleet Level</span>
                        )}
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${categoryBg[cat] || 'bg-surface-variant text-on-surface-variant'}`}>
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {categoryIcons[cat] || 'receipt'}
                            </span>
                          </div>
                          <span className="font-body-sm text-on-surface capitalize">{cat.toLowerCase()}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md font-body-sm text-on-surface-variant max-w-[200px] truncate" title={expense.description}>
                        {expense.description || 'No description'}
                      </td>
                      <td className="px-lg py-md font-body-sm text-on-surface-variant">
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </td>
                      <td className="px-lg py-md font-body-sm text-on-surface">{expense.users?.full_name || 'System'}</td>
                      <td className="px-lg py-md font-kpi-md text-on-surface text-right">
                        ${Number(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-lg py-md text-center">
                        {expense.receipt_url ? (
                          <a
                            href={expense.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:bg-primary/10 p-1.5 rounded transition-all inline-block"
                          >
                            <span className="material-symbols-outlined text-lg">attachment</span>
                          </a>
                        ) : (
                          <span className="text-outline/30 text-body-sm">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Statistics Bar */}
        <div className="px-lg py-md bg-surface-container-low flex justify-between items-center border-t border-surface-container">
          <span className="font-body-sm text-on-surface-variant">
            Showing {filteredExpenses.length} of {expenses.length} entries
          </span>
        </div>
      </div>

      <ExpenseFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchExpenses}
      />
    </div>
  );
};

export default ExpenseLedger;