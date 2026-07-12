import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

const emptyForm = {
  full_name: '',
  phone: '',
  email: '',
  license_number: '',
  license_expiry_date: '',
  license_category_id: '',
  driver_status_id: '',
  safety_score: '100',
  joining_date: '',
};

export const DriverFormModal = ({ isOpen, onClose, driver = null, onSaved }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  // Metadata loaders
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const isEdit = Boolean(driver);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch license categories and status definitions
    (async () => {
      try {
        const meta = await apiClient.get('/drivers/meta');
        setCategories(meta.categories || []);
        setStatuses(meta.statuses || []);
      } catch (err) {
        setApiError('Failed to load form metadata options.');
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (driver) {
        setFormData({
          full_name: driver.full_name ?? '',
          phone: driver.phone ?? '',
          email: driver.email ?? '',
          license_number: driver.license_number ?? '',
          license_expiry_date: driver.license_expiry_date ?? '',
          license_category_id: driver.license_category_id ?? '',
          driver_status_id: driver.driver_status_id ?? '',
          safety_score: String(driver.safety_score ?? '100'),
          joining_date: driver.joining_date ?? '',
        });
      } else {
        setFormData(emptyForm);
      }
      setErrors({});
      setApiError('');
    }
  }, [isOpen, driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!formData.full_name.trim()) next.full_name = 'Full name is required.';
    if (!formData.phone.trim()) next.phone = 'Phone number is required.';
    if (!formData.license_number.trim()) next.license_number = 'License number is required.';
    if (!formData.license_expiry_date) next.license_expiry_date = 'License expiry date is required.';
    if (!formData.license_category_id) next.license_category_id = 'License category is required.';
    if (!formData.driver_status_id) next.driver_status_id = 'Driver status is required.';
    
    const score = Number(formData.safety_score);
    if (formData.safety_score !== '' && (isNaN(score) || score < 0 || score > 100)) {
      next.safety_score = 'Safety score must be between 0 and 100.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSaving(true);
    const payload = {
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      license_number: formData.license_number.trim(),
      license_expiry_date: formData.license_expiry_date,
      license_category_id: Number(formData.license_category_id),
      driver_status_id: Number(formData.driver_status_id),
      safety_score: Number(formData.safety_score) || 100,
      joining_date: formData.joining_date || null,
    };

    try {
      if (isEdit) {
        await apiClient.put(`/drivers/${driver.driver_id}`, payload);
      } else {
        await apiClient.post('/drivers', payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setApiError(err.message || 'An error occurred while saving the driver profile.');
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
              <span className="material-symbols-outlined">person_add</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {isEdit ? 'Edit Driver Profile' : 'Register New Driver'}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Configure compliance details and metadata parameters.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-xl space-y-lg">
          {apiError && (
            <div className="p-md rounded-lg bg-error/10 text-error text-body-sm border border-error/20">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            
            {/* Full Name */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Full Name <span className="text-error">*</span></label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Elena Rodriguez"
                className={inputClass}
                required
              />
              {errors.full_name && <p className={errorTextClass}>{errors.full_name}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Phone Number <span className="text-error">*</span></label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 019-2834"
                className={inputClass}
                required
              />
              {errors.phone && <p className={errorTextClass}>{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. e.rodriguez@transitops.com"
                className={inputClass}
              />
            </div>

            {/* License Number */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>License Number <span className="text-error">*</span></label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                placeholder="e.g. LIC-9920193-TX"
                className={inputClass}
                required
              />
              {errors.license_number && <p className={errorTextClass}>{errors.license_number}</p>}
            </div>

            {/* License Category */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>License Category <span className="text-error">*</span></label>
              <select
                name="license_category_id"
                value={formData.license_category_id}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select license category...</option>
                {categories.map((c) => (
                  <option key={c.license_category_id} value={c.license_category_id}>
                    {c.category_name} ({c.category_code})
                  </option>
                ))}
              </select>
              {errors.license_category_id && <p className={errorTextClass}>{errors.license_category_id}</p>}
            </div>

            {/* License Expiry */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>License Expiry Date <span className="text-error">*</span></label>
              <input
                type="date"
                name="license_expiry_date"
                value={formData.license_expiry_date}
                onChange={handleChange}
                className={inputClass}
                required
              />
              {errors.license_expiry_date && <p className={errorTextClass}>{errors.license_expiry_date}</p>}
            </div>

            {/* Driver Status */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Driver Status <span className="text-error">*</span></label>
              <select
                name="driver_status_id"
                value={formData.driver_status_id}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select operational status...</option>
                {statuses.map((s) => (
                  <option key={s.driver_status_id} value={s.driver_status_id}>
                    {s.status_name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
              {errors.driver_status_id && <p className={errorTextClass}>{errors.driver_status_id}</p>}
            </div>

            {/* Safety Score */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Safety Score (0 - 100)</label>
              <input
                type="number"
                name="safety_score"
                value={formData.safety_score}
                onChange={handleChange}
                min="0"
                max="100"
                className={inputClass}
              />
              {errors.safety_score && <p className={errorTextClass}>{errors.safety_score}</p>}
            </div>

            {/* Joining Date */}
            <div className="flex flex-col gap-xs">
              <label className={labelClass}>Joining Date</label>
              <input
                type="date"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
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
              <span>{saving ? 'Saving...' : 'Save Driver'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default DriverFormModal;
