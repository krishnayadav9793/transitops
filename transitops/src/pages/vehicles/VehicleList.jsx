import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '../../services/apiClient';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import VehicleFormModal from './VehicleFormModal';

// Live schema status names -> badge variants (per spec colors)
const STATUS_BADGE = {
  AVAILABLE: 'success',  // green
  ON_TRIP: 'info',       // blue
  IN_SHOP: 'warning',    // orange
  RETIRED: 'danger',     // red
};

const STATUS_OPTIONS = ['All', 'AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];

// "ON_TRIP" -> "On Trip"
const pretty = (s) =>
  (s || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState(null); // 'current_odometer_km' | 'purchase_cost'
  const [sortDir, setSortDir] = useState('asc');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [actionError, setActionError] = useState('');

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await apiClient.get('/vehicles');
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const visibleVehicles = useMemo(() => {
    let list = [...vehicles];

    if (statusFilter !== 'All') {
      list = list.filter((v) => v.vehicle_statuses?.status_name === statusFilter);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (v) =>
          v.registration_number?.toLowerCase().includes(q) ||
          v.vehicle_name?.toLowerCase().includes(q) ||
          v.model?.toLowerCase().includes(q) ||
          v.vehicle_types?.type_name?.toLowerCase().includes(q) ||
          v.regions?.region_name?.toLowerCase().includes(q)
      );
    }

    if (sortKey) {
      list.sort((a, b) => {
        const diff = Number(a[sortKey] ?? 0) - Number(b[sortKey] ?? 0);
        return sortDir === 'asc' ? diff : -diff;
      });
    }

    return list;
  }, [vehicles, search, statusFilter, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIndicator = (key) =>
    sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  const handleAdd = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const handleDelete = async (vehicle) => {
    if (!window.confirm(`Remove vehicle '${vehicle.registration_number}' from the registry?`)) return;
    setActionError('');
    try {
      await apiClient.delete(`/vehicles/${vehicle.vehicle_id}`);
      fetchVehicles();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vehicle Registry</h1>
          <p className="text-gray-500 dark:text-gray-400">Master list of fleet vehicles.</p>
        </div>
        <Button onClick={handleAdd}>+ Add Vehicle</Button>
      </div>

      {(loadError || actionError) && (
        <div className="px-3 py-2 rounded-md bg-red-100 text-red-800 text-sm dark:bg-red-900/30 dark:text-red-400">
          {loadError || actionError}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-64">
          <Input
            label="Search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Reg number, name, model, type…"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All' : pretty(s)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
          <thead className="bg-gray-50 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Registration No.</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name / Model</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Type</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Max Load (kg)</th>
              <th
                className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                onClick={() => toggleSort('current_odometer_km')}
                title="Sort by odometer"
              >
                Odometer (km){sortIndicator('current_odometer_km')}
              </th>
              <th
                className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                onClick={() => toggleSort('purchase_cost')}
                title="Sort by acquisition cost"
              >
                Acquisition Cost{sortIndicator('purchase_cost')}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Region</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-slate-950">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Loading vehicles…
                </td>
              </tr>
            ) : visibleVehicles.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {vehicles.length === 0
                    ? 'No vehicles registered yet. Click "+ Add Vehicle" to create the first one.'
                    : 'No vehicles match the current search/filter.'}
                </td>
              </tr>
            ) : (
              visibleVehicles.map((v) => {
                const statusName = v.vehicle_statuses?.status_name;
                return (
                  <tr key={v.vehicle_id} className="hover:bg-gray-50 dark:hover:bg-slate-900/60">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{v.registration_number}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {v.vehicle_name}{v.model && v.model !== v.vehicle_name ? ` / ${v.model}` : ''}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{pretty(v.vehicle_types?.type_name)}</td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{Number(v.capacity_kg).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{Number(v.current_odometer_km).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{Number(v.purchase_cost).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{pretty(v.regions?.region_name)}</td>
                    <td className="px-4 py-3">
                      <Badge status={STATUS_BADGE[statusName] || 'default'}>{pretty(statusName) || 'Unknown'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(v)}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <VehicleFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicle={editingVehicle}
        onSaved={fetchVehicles}
      />
    </div>
  );
};

export default VehicleList;
