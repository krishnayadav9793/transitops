import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';

const emptyForm = {
  vehicle_id: '',
  maintenance_type_id: '',
  problem_description: '',
  estimated_cost: '',
  start_date: new Date().toISOString().split('T')[0],
  expected_completion_date: '',
};

export const ScheduleMaintenance = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Selector choices loaded from API
  const [vehicles, setVehicles] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // Fetch active vehicles from expenses metadata or custom fetch
        const expMeta = await apiClient.get('/expenses/meta');
        setVehicles(expMeta.vehicles || []);

        const mntTypes = await apiClient.get('/maintenance/types');
        setTypes(mntTypes || []);
      } catch (err) {
        setApiError('Failed to load vehicle and service type options.');
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!formData.vehicle_id) next.vehicle_id = 'Vehicle is required.';
    if (!formData.maintenance_type_id) next.maintenance_type_id = 'Service type is required.';
    if (!formData.problem_description.trim()) next.problem_description = 'Work description is required.';
    if (!formData.start_date) next.start_date = 'Start date is required.';
    
    if (formData.estimated_cost && Number(formData.estimated_cost) < 0) {
      next.estimated_cost = 'Cost estimate cannot be negative.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      vehicle_id: Number(formData.vehicle_id),
      maintenance_type_id: Number(formData.maintenance_type_id),
      problem_description: formData.problem_description.trim(),
      estimated_cost: formData.estimated_cost ? Number(formData.estimated_cost) : 0,
      start_date: formData.start_date,
      expected_completion_date: formData.expected_completion_date || null,
    };

    try {
      await apiClient.post('/maintenance', payload);
      navigate('/maintenance');
    } catch (err) {
      setApiError(err.message || 'Failed to submit maintenance scheduled log.');
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = 'font-label-caps text-on-surface-variant block mb-1';
  const selectClass = 'w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors outline-none';
  const inputClass = 'w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors outline-none';
  const errorClass = 'text-xs text-error mt-1';

  return (
    <div className="space-y-xl">
      
      {/* Header Bar */}
      <form onSubmit={handleSubmit} className="space-y-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div>
            <nav className="flex items-center space-x-sm mb-xs text-on-surface-variant font-body-sm">
              <Link to="/maintenance" className="hover:text-primary">Maintenance</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-bold">New Record</span>
            </nav>
            <h2 className="font-headline-lg text-on-surface">Schedule Vehicle Maintenance</h2>
          </div>
          <div className="flex space-x-md">
            <Link
              to="/maintenance"
              className="px-lg py-md border border-outline text-on-surface-variant rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-lg py-md bg-primary text-on-primary rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-sm"
            >
              <span className="material-symbols-outlined text-md">save</span>
              <span>{submitting ? 'Submitting...' : 'Submit Record'}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        {apiError && (
          <div className="p-md bg-error/10 text-error rounded-xl border border-error/20 font-body-sm">
            {apiError}
          </div>
        )}

        <div className="grid grid-cols-12 gap-xl">
          <section className="col-span-12 lg:col-span-8">
            <div className="bg-surface-container-lowest rounded-xl p-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10">
              <div className="space-y-xl">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  
                  {/* Select Vehicle */}
                  <div className="space-y-xs">
                    <label className={labelClass}>Select Vehicle <span className="text-error">*</span></label>
                    <select
                      name="vehicle_id"
                      value={formData.vehicle_id}
                      onChange={handleChange}
                      className={selectClass}
                      required
                    >
                      <option value="">Choose vehicle...</option>
                      {vehicles.map((v) => (
                        <option key={v.vehicle_id} value={v.vehicle_id}>
                          {v.vehicle_name || 'Vehicle'} ({v.registration_number})
                        </option>
                      ))}
                    </select>
                    {errors.vehicle_id && <p className={errorClass}>{errors.vehicle_id}</p>}
                  </div>

                  {/* Service Type */}
                  <div className="space-y-xs">
                    <label className={labelClass}>Service Type <span className="text-error">*</span></label>
                    <select
                      name="maintenance_type_id"
                      value={formData.maintenance_type_id}
                      onChange={handleChange}
                      className={selectClass}
                      required
                    >
                      <option value="">Select category type...</option>
                      {types.map((t) => (
                        <option key={t.maintenance_type_id} value={t.maintenance_type_id}>
                          {t.type_name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                    {errors.maintenance_type_id && <p className={errorClass}>{errors.maintenance_type_id}</p>}
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  
                  {/* Start Date */}
                  <div className="space-y-xs">
                    <label className={labelClass}>Start Date <span className="text-error">*</span></label>
                    <input
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                    {errors.start_date && <p className={errorClass}>{errors.start_date}</p>}
                  </div>

                  {/* Expected Completion */}
                  <div className="space-y-xs">
                    <label className={labelClass}>Expected Completion</label>
                    <input
                      name="expected_completion_date"
                      type="date"
                      value={formData.expected_completion_date}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                </div>

                {/* Cost */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-xs">
                    <label className={labelClass}>Estimated Cost (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                      <input
                        name="estimated_cost"
                        type="number"
                        value={formData.estimated_cost}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="any"
                        className="w-full pl-8 pr-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors outline-none"
                      />
                    </div>
                    {errors.estimated_cost && <p className={errorClass}>{errors.estimated_cost}</p>}
                  </div>
                </div>

                {/* Problem Description */}
                <div className="space-y-xs">
                  <label className={labelClass}>Description & Work Notes <span className="text-error">*</span></label>
                  <textarea
                    name="problem_description"
                    value={formData.problem_description}
                    onChange={handleChange}
                    placeholder="Detail specific issues, warning codes, parts to check, or reason for servicing..."
                    rows="4"
                    className="w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors outline-none"
                    required
                  />
                  {errors.problem_description && <p className={errorClass}>{errors.problem_description}</p>}
                </div>

              </div>
            </div>
          </section>

          {/* Guidelines Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-xl">
            <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/30 space-y-sm">
              <h3 className="font-headline-sm text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">info</span>
                Scheduling Rules
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Submitting this record will automatically place the selected vehicle status in **IN SHOP** (In Maintenance).
              </p>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                The vehicle will be unavailable for trip dispatches until this maintenance log is marked as **COMPLETED** or **CLOSED**.
              </p>
            </div>
          </aside>
        </div>
      </form>

    </div>
  );
};

export default ScheduleMaintenance;
