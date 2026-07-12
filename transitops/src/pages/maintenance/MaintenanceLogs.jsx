import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '../../services/apiClient';
import { supabase } from '../../utils/supabase';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

// Live schema maintenance status names -> badge variants
const STATUS_BADGE = {
  PENDING: 'warning',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

// "OIL_CHANGE" -> "Oil Change"
const pretty = (s) =>
  (s || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const emptyForm = {
  vehicle_id: '',
  maintenance_type_id: '',
  description: '',
  estimated_cost: '',
  start_date: new Date().toISOString().slice(0, 10),
  expected_completion_date: '',
};

export const MaintenanceLogs = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [closingId, setClosingId] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setPageError('');
    try {
      const [logsData, vehiclesData, typesData] = await Promise.all([
        apiClient.get('/maintenance'),
        apiClient.get('/vehicles'),
        supabase.from('maintenance_types').select('*').order('maintenance_type_id'),
      ]);
      setLogs(Array.isArray(logsData) ? logsData : []);
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      setTypes(typesData.data || []);
    } catch (err) {
      setPageError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Only Available vehicles can enter the shop (business rule)
  const eligibleVehicles = useMemo(
    () => vehicles.filter((v) => v.vehicle_statuses?.status_name === 'AVAILABLE'),
    [vehicles]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.vehicle_id) {
      setFormError('Please select a vehicle.');
      return;
    }
    if (!form.maintenance_type_id) {
      setFormError('Please select a maintenance type.');
      return;
    }
    if (form.estimated_cost !== '' && Number(form.estimated_cost) < 0) {
      setFormError('Cost cannot be negative.');
      return;
    }
    if (!form.start_date) {
      setFormError('Please pick a start date.');
      return;
    }

    setSaving(true);
    try {
      await apiClient.post('/maintenance', {
        vehicle_id: Number(form.vehicle_id),
        maintenance_type_id: Number(form.maintenance_type_id),
        description: form.description,
        estimated_cost: form.estimated_cost === '' ? null : Number(form.estimated_cost),
        start_date: form.start_date,
        expected_completion_date: form.expected_completion_date || null,
      });
      setForm(emptyForm);
      fetchAll(); // refreshes logs AND vehicle statuses (vehicle is now In Shop)
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async (log) => {
    const typeName = pretty(log.maintenance_types?.type_name) || 'maintenance';
    if (!window.confirm(`Close this ${typeName} record? The vehicle will return to the dispatch pool.`)) return;
    setPageError('');
    setClosingId(log.maintenance_id);
    try {
      await apiClient.put(`/maintenance/${log.maintenance_id}/close`, {});
      fetchAll();
    } catch (err) {
      setPageError(err.message);
    } finally {
      setClosingId(null);
    }
  };

  const isOpenStatus = (log) => {
    const s = log.maintenance_statuses?.status_name;
    return s === 'PENDING' || s === 'IN_PROGRESS';
  };

  const selectClass =
    'px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Maintenance Logs</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Opening a log moves the vehicle to <span className="font-medium">In Shop</span> and removes it from dispatch;
          closing it restores the vehicle to <span className="font-medium">Available</span> (unless retired).
        </p>
      </div>

      {pageError && (
        <div className="px-3 py-2 rounded-md bg-red-100 text-red-800 text-sm dark:bg-red-900/30 dark:text-red-400">
          {pageError}
        </div>
      )}

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 p-4 space-y-4"
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">New Maintenance Record</h2>

        {formError && (
          <div className="px-3 py-2 rounded-md bg-red-100 text-red-800 text-sm dark:bg-red-900/30 dark:text-red-400">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Vehicle <span className="text-red-500">*</span>
            </label>
            <select name="vehicle_id" value={form.vehicle_id} onChange={handleChange} className={selectClass}>
              <option value="">Select vehicle…</option>
              {eligibleVehicles.map((v) => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.registration_number} ({v.vehicle_name})
                </option>
              ))}
            </select>
            {eligibleVehicles.length === 0 && !loading && (
              <span className="text-xs text-gray-500 dark:text-gray-400">No Available vehicles right now.</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type <span className="text-red-500">*</span>
            </label>
            <select name="maintenance_type_id" value={form.maintenance_type_id} onChange={handleChange} className={selectClass}>
              <option value="">Select type…</option>
              {types.map((t) => (
                <option key={t.maintenance_type_id} value={t.maintenance_type_id}>
                  {pretty(t.type_name)}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. Routine oil change"
          />
          <Input
            label="Estimated Cost"
            type="number"
            name="estimated_cost"
            value={form.estimated_cost}
            onChange={handleChange}
            placeholder="e.g. 2500"
            min="0"
            step="any"
          />
          <Input
            label="Start Date"
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
          <Input
            label="Est. Completion"
            type="date"
            name="expected_completion_date"
            value={form.expected_completion_date}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving || eligibleVehicles.length === 0}>
            {saving ? 'Creating…' : 'Create Record'}
          </Button>
        </div>
      </form>

      {/* Logs table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
          <thead className="bg-gray-50 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Vehicle</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Type</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Est. Cost</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Actual Cost</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Start Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-slate-950">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Loading maintenance logs…
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No maintenance records yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const statusName = log.maintenance_statuses?.status_name;
                return (
                  <tr key={log.maintenance_id} className="hover:bg-gray-50 dark:hover:bg-slate-900/60">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {log.vehicles
                        ? `${log.vehicles.registration_number} (${log.vehicles.vehicle_name})`
                        : `Vehicle #${log.vehicle_id}`}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{pretty(log.maintenance_types?.type_name)}</td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                      {log.estimated_cost != null ? Number(log.estimated_cost).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                      {log.actual_cost != null ? Number(log.actual_cost).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.start_date}</td>
                    <td className="px-4 py-3">
                      <Badge status={STATUS_BADGE[statusName] || 'default'}>{pretty(statusName) || 'Unknown'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isOpenStatus(log) && (
                        <Button
                          variant="secondary"
                          className="!px-3 !py-1 text-xs"
                          onClick={() => handleClose(log)}
                          disabled={closingId === log.maintenance_id}
                        >
                          {closingId === log.maintenance_id ? 'Closing…' : 'Close'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceLogs;
