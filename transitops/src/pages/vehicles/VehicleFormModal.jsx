<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { supabase } from '../../utils/supabase';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

// "ON_TRIP" -> "On Trip"
const pretty = (s) =>
  (s || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const emptyForm = {
  registration_number: '',
  vehicle_name: '',
  model: '',
  vehicle_type_id: '',
  capacity_kg: '',
  current_odometer_km: '',
  purchase_cost: '',
  region_id: '',
  status: 'AVAILABLE',
};

export const VehicleFormModal = ({ isOpen, onClose, vehicle = null, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  const [types, setTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const isEdit = Boolean(vehicle);

  // Lookup options come straight from the shared Supabase client (read-only)
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const [t, r, s] = await Promise.all([
        supabase.from('vehicle_types').select('*').order('vehicle_type_id'),
        supabase.from('regions').select('*').order('region_id'),
        supabase.from('vehicle_statuses').select('*').order('vehicle_status_id'),
      ]);
      setTypes(t.data || []);
      setRegions(r.data || []);
      setStatuses(s.data || []);
    })();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setForm(vehicle ? {
        registration_number: vehicle.registration_number ?? '',
        vehicle_name: vehicle.vehicle_name ?? '',
        model: vehicle.model ?? '',
        vehicle_type_id: vehicle.vehicle_type_id ?? '',
        capacity_kg: vehicle.capacity_kg ?? '',
        current_odometer_km: vehicle.current_odometer_km ?? '',
        purchase_cost: vehicle.purchase_cost ?? '',
        region_id: vehicle.region_id ?? '',
        status: vehicle.vehicle_statuses?.status_name ?? 'AVAILABLE',
      } : emptyForm);
      setErrors({});
      setApiError('');
    }
  }, [isOpen, vehicle]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.registration_number.trim()) next.registration_number = 'Registration number is required.';
    if (!form.vehicle_name.trim()) next.vehicle_name = 'Vehicle name is required.';
    if (!form.vehicle_type_id) next.vehicle_type_id = 'Type is required.';
    if (!form.region_id) next.region_id = 'Region is required.';
    if (form.capacity_kg === '' || Number(form.capacity_kg) <= 0) {
      next.capacity_kg = 'Max load capacity must be greater than 0.';
    }
    if (form.current_odometer_km !== '' && Number(form.current_odometer_km) < 0) {
      next.current_odometer_km = 'Odometer cannot be negative.';
    }
    if (form.purchase_cost === '' || Number(form.purchase_cost) < 0) {
      next.purchase_cost = 'Acquisition cost is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    const payload = {
      registration_number: form.registration_number.trim(),
      vehicle_name: form.vehicle_name.trim(),
      model: form.model.trim() || form.vehicle_name.trim(),
      vehicle_type_id: Number(form.vehicle_type_id),
      capacity_kg: Number(form.capacity_kg),
      current_odometer_km: Number(form.current_odometer_km) || 0,
      purchase_cost: Number(form.purchase_cost),
      region_id: Number(form.region_id),
    };
    if (isEdit) payload.status = form.status;

    setSaving(true);
    try {
      if (isEdit) {
        await apiClient.put(`/vehicles/${vehicle.vehicle_id}`, payload);
      } else {
        await apiClient.post('/vehicles', payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      // Surfaces backend errors, e.g. duplicate registration number (409)
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    'px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
        </h2>

        {apiError && (
          <div className="mb-4 px-3 py-2 rounded-md bg-red-100 text-red-800 text-sm dark:bg-red-900/30 dark:text-red-400">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registration Number"
            name="registration_number"
            value={form.registration_number}
            onChange={handleChange}
            placeholder="e.g. GJ-01-AB-1234"
            error={errors.registration_number}
            required
          />
          <Input
            label="Vehicle Name"
            name="vehicle_name"
            value={form.vehicle_name}
            onChange={handleChange}
            placeholder="e.g. Van-05"
            error={errors.vehicle_name}
            required
          />
          <Input
            label="Model"
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="e.g. Tata Ace (defaults to name)"
          />

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type <span className="text-red-500">*</span>
            </label>
            <select name="vehicle_type_id" value={form.vehicle_type_id} onChange={handleChange} className={selectClass}>
              <option value="">Select type…</option>
              {types.map((t) => (
                <option key={t.vehicle_type_id} value={t.vehicle_type_id}>{pretty(t.type_name)}</option>
              ))}
            </select>
            {errors.vehicle_type_id && <span className="text-xs text-red-500">{errors.vehicle_type_id}</span>}
          </div>

          <Input
            label="Max Load Capacity (kg)"
            type="number"
            name="capacity_kg"
            value={form.capacity_kg}
            onChange={handleChange}
            placeholder="e.g. 500"
            error={errors.capacity_kg}
            required
            min="1"
            step="any"
          />
          <Input
            label="Odometer (km)"
            type="number"
            name="current_odometer_km"
            value={form.current_odometer_km}
            onChange={handleChange}
            placeholder="e.g. 12000"
            error={errors.current_odometer_km}
            min="0"
            step="any"
          />
          <Input
            label="Acquisition Cost"
            type="number"
            name="purchase_cost"
            value={form.purchase_cost}
            onChange={handleChange}
            placeholder="e.g. 850000"
            error={errors.purchase_cost}
            required
            min="0"
            step="any"
          />

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Region <span className="text-red-500">*</span>
            </label>
            <select name="region_id" value={form.region_id} onChange={handleChange} className={selectClass}>
              <option value="">Select region…</option>
              {regions.map((r) => (
                <option key={r.region_id} value={r.region_id}>{pretty(r.region_name)}</option>
              ))}
            </select>
            {errors.region_id && <span className="text-xs text-red-500">{errors.region_id}</span>}
          </div>

          {isEdit && (
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={selectClass}>
                {statuses.map((s) => (
                  <option key={s.vehicle_status_id} value={s.status_name}>{pretty(s.status_name)}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
=======
import React, { useState } from 'react';

export const VehicleFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    registration: '',
    model: '',
    type: 'Heavy Duty Truck',
    capacity: '',
    fuelType: 'Diesel',
    odometer: '',
    region: 'Central Hub',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-lg">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-md">
            <div className="bg-primary-container p-sm rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined">directions_bus</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Add New Vehicle</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Register a new asset into the TransitOps fleet network.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-xl py-xl overflow-y-auto max-h-[716px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-xl gap-y-lg">
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Registration Number</label>
              <input name="registration" value={formData.registration} onChange={handleChange} className="px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest" placeholder="e.g. TR-2024-B882" type="text" />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Model / Make</label>
              <input name="model" value={formData.model} onChange={handleChange} className="px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest" placeholder="e.g. Scania R-Series" type="text" />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Vehicle Type</label>
              <div className="relative">
                <select name="type" value={formData.type} onChange={handleChange} className="w-full appearance-none px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest cursor-pointer">
                  <option>Heavy Duty Truck</option>
                  <option>Semi-Trailer</option>
                  <option>Light Commercial Vehicle</option>
                  <option>Last-Mile Van</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Capacity (Weight/Volume)</label>
              <div className="relative">
                <input name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest" placeholder="25.5" type="text" />
                <span className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">TONNES</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Fuel Type</label>
              <div className="relative">
                <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full appearance-none px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest cursor-pointer">
                  <option>Diesel</option>
                  <option>LNG / Biogas</option>
                  <option>Electric</option>
                  <option>Hydrogen</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Odometer Reading</label>
              <div className="relative">
                <input name="odometer" value={formData.odometer} onChange={handleChange} className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest" placeholder="0.00" type="number" />
                <span className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">KM</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Operating Region</label>
              <div className="relative">
                <select name="region" value={formData.region} onChange={handleChange} className="w-full appearance-none px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest cursor-pointer">
                  <option>Central Hub</option>
                  <option>Nordic Corridor</option>
                  <option>Coastal Logistics</option>
                  <option>Eastern Expressway</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Initial Status</label>
              <div className="flex items-center gap-md py-sm">
                {['Active', 'Standby', 'In Prep'].map((s) => (
                  <label key={s} className="flex items-center gap-xs cursor-pointer group">
                    <input type="radio" name="status" value={s} checked={formData.status === s} onChange={handleChange} className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" />
                    <span className="text-on-surface group-hover:text-primary transition-colors">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 mt-md">
              <div className="p-md bg-surface-container-low rounded-xl border border-dashed border-outline flex items-center justify-center gap-md group cursor-pointer hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">cloud_upload</span>
                <span className="text-on-surface-variant text-body-sm group-hover:text-on-surface transition-colors">Upload vehicle documents or photos (optional)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-xl py-lg bg-surface-container-low border-t border-outline-variant flex justify-end items-center gap-md">
          <button onClick={onClose} className="px-lg py-sm font-semibold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all">Cancel</button>
          <button className="bg-primary hover:bg-primary-container text-white px-xl py-sm rounded-lg font-semibold shadow-md transform active:scale-95 transition-all">Save Vehicle</button>
        </div>
>>>>>>> 825038f (feat(frontend): implement TransitOps screens and layout)
      </div>
    </div>
  );
};

export default VehicleFormModal;
