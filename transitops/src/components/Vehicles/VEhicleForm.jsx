import React, { useState, useEffect } from 'react';
import { createVehicle, getVehicleTypes } from '../../api/fleet';

const VehicleForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    registration_number: '', vehicle_name: '', model: '', vehicle_type_id: '', capacity_kg: '', current_odometer_km: '0', purchase_cost: ''
  });
  const [types, setTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getVehicleTypes().then(({ data }) => setTypes(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVehicle(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create vehicle');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="p-8 w-full max-w-2xl shadow-2xl rounded-2xl bg-surface-container-lowest relative">
        <h3 className="text-xl font-bold text-on-surface mb-6">Register New Vehicle</h3>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Registration Number</label>
            <input required type="text" className="w-full p-2.5 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" onChange={e => setFormData({...formData, registration_number: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Vehicle Type</label>
            <select required className="w-full p-2.5 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white" onChange={e => setFormData({...formData, vehicle_type_id: e.target.value})}>
              <option value="">Select Type</option>
              {types.map(t => <option key={t.vehicle_type_id} value={t.vehicle_type_id}>{t.type_name}</option>)}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Model / Make</label>
            <input required type="text" className="w-full p-2.5 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" onChange={e => setFormData({...formData, model: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Max Load Capacity (KG)</label>
            <input required type="number" step="0.01" className="w-full p-2.5 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" onChange={e => setFormData({...formData, capacity_kg: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Initial Odometer (KM)</label>
            <input required type="number" step="0.01" value={formData.current_odometer_km} className="w-full p-2.5 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" onChange={e => setFormData({...formData, current_odometer_km: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Acquisition Cost</label>
            <input type="number" step="0.01" className="w-full p-2.5 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" onChange={e => setFormData({...formData, purchase_cost: e.target.value})} />
          </div>
          
          <div className="col-span-2 mt-4 pt-5 border-t border-outline-variant flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm text-on-surface-variant font-medium hover:bg-surface-container rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 text-sm bg-primary hover:opacity-90 text-on-primary font-medium rounded-lg transition-colors shadow-sm">Save Vehicle</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;