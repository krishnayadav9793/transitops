import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

const emptyForm = {
  expense_category_id: '',
  vehicle_id: '',
  trip_id: '',
  maintenance_id: '',
  expense_date: new Date().toISOString().split('T')[0],
  amount: '',
  description: '',
  receipt_url: '',
};

export const ExpenseFormModal = ({ isOpen, onClose, onSaved }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  // Metadata arrays
  const [categories, setCategories] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const meta = await apiClient.get('/expenses/meta');
        setCategories(meta.categories || []);
        setVehicles(meta.vehicles || []);
        setTrips(meta.trips || []);
        setMaintenanceRecords(meta.maintenance || []);
      } catch (err) {
        setApiError('Failed to load expense category and reference options.');
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData(emptyForm);
      setErrors({});
      setApiError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!formData.expense_category_id) next.expense_category_id = 'Expense category is required.';
    if (!formData.amount || Number(formData.amount) <= 0) {
      next.amount = 'Valid amount greater than 0 is required.';
    }
    if (!formData.expense_date) next.expense_date = 'Date is required.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSaving(true);
    const payload = {
      expense_category_id: Number(formData.expense_category_id),
      vehicle_id: formData.vehicle_id ? Number(formData.vehicle_id) : null,
      trip_id: formData.trip_id ? Number(formData.trip_id) : null,
      maintenance_id: formData.maintenance_id ? Number(formData.maintenance_id) : null,
      expense_date: formData.expense_date,
      amount: Number(formData.amount),
      description: formData.description.trim() || null,
      receipt_url: formData.receipt_url.trim() || null,
    };

    try {
      await apiClient.post('/expenses', payload);
      onSaved?.();
      onClose();
    } catch (err) {
      setApiError(err.message || 'Failed to submit expense entry.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const labelClass = 'font-body-sm text-body-sm text-on-surface-variant ml-xs';
  const inputClass = 'w-full border border-outline-variant rounded-lg p-md text-body-md bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all';
  const errorTextClass = 'text-xs text-error mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-lg">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-md">
            <div className="bg-primary-container p-sm rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Record Operations Expense</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Log fuel refills, toll bridge passes, repair costs, or permits.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-xl space-y-lg">
          {apiError && (
            <div className="p-md rounded-lg bg-error/10 text-error text-body-sm border border-error/20">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            
            {/* Category */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Category <span className="text-error">*</span></label>
              <select
                name="expense_category_id"
                value={formData.expense_category_id}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select expense category...</option>
                {categories.map((c) => (
                  <option key={c.expense_category_id} value={c.expense_category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
              {errors.expense_category_id && <p className={errorTextClass}>{errors.expense_category_id}</p>}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Amount ($) <span className="text-error">*</span></label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 145.00"
                min="0.01"
                step="any"
                className={inputClass}
                required
              />
              {errors.amount && <p className={errorTextClass}>{errors.amount}</p>}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Expense Date <span className="text-error">*</span></label>
              <input
                type="date"
                name="expense_date"
                value={formData.expense_date}
                onChange={handleChange}
                className={inputClass}
                required
              />
              {errors.expense_date && <p className={errorTextClass}>{errors.expense_date}</p>}
            </div>

            {/* Associated Vehicle */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Associated Vehicle (Optional)</label>
              <select
                name="vehicle_id"
                value={formData.vehicle_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">None / Fleet Level</option>
                {vehicles.map((v) => (
                  <option key={v.vehicle_id} value={v.vehicle_id}>
                    {v.vehicle_name || 'Vehicle'} ({v.registration_number})
                  </option>
                ))}
              </select>
            </div>

            {/* Associated Trip */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Associated Trip (Optional)</label>
              <select
                name="trip_id"
                value={formData.trip_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">None / Not Trip Related</option>
                {trips.map((t) => (
                  <option key={t.trip_id} value={t.trip_id}>
                    Trip #{t.trip_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Associated Maintenance */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Associated Maintenance (Optional)</label>
              <select
                name="maintenance_id"
                value={formData.maintenance_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">None / Not Maintenance Related</option>
                {maintenanceRecords.map((m) => (
                  <option key={m.maintenance_id} value={m.maintenance_id}>
                    Issue ID: {m.maintenance_id} - {m.problem_description.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Receipt URL */}
            <div className="flex flex-col gap-xs md:col-span-2">
              <label className={labelClass}>Receipt / Invoice URL Attachment</label>
              <input
                type="text"
                name="receipt_url"
                value={formData.receipt_url}
                onChange={handleChange}
                placeholder="e.g. https://storage.transitops.com/receipts/rec-992.pdf"
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-xs md:col-span-2">
              <label className={labelClass}>Description / Remarks</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Fuel refill Shell Chicago Hub, Route 95 bridge tolls..."
                rows="3"
                className={inputClass}
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="px-xl py-lg bg-surface-container-low border-t border-outline-variant flex justify-end items-center gap-md mt-lg -mx-xl -mb-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-xl py-md text-on-surface-variant font-medium hover:bg-surface-container transition-colors rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3xl py-md bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:bg-primary-container transition-all active:scale-95 flex items-center gap-md cursor-pointer"
            >
              <span className="material-symbols-outlined">save</span>
              <span>{saving ? 'Recording...' : 'Submit Expense'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ExpenseFormModal;
