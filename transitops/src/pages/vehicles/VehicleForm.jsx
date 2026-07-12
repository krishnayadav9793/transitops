import React, { useState, useEffect } from 'react';
import { createVehicle, getVehicleTypes } from '../../api/fleet';

const VehicleForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    registration_number: '', vehicle_name: '', model: '', vehicle_type_id: '', capacity_kg: '', current_odometer_km: '0.00', purchase_cost: ''
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
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="p-8 w-full max-w-2xl shadow-2xl rounded-2xl bg-white relative my-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#1C5B3E] p-2.5 rounded-xl text-white shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Add New Vehicle</h3>
            <p className="text-sm text-gray-500">Register a new asset into the TransitOps fleet network.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Registration Number</label>
            <input required type="text" placeholder="e.g. TR-2024-B882" className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400" onChange={e => setFormData({...formData, registration_number: e.target.value})} />
          </div>
          
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Model / Make</label>
            <input required type="text" placeholder="e.g. Scania R-Series" className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400" onChange={e => setFormData({...formData, model: e.target.value})} />
          </div>
          
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Vehicle Type</label>
            <select required className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm bg-white text-gray-700" onChange={e => setFormData({...formData, vehicle_type_id: e.target.value})}>
              <option value="">Select Type</option>
              {types.map(t => <option key={t.vehicle_type_id} value={t.vehicle_type_id}>{t.type_name}</option>)}
            </select>
          </div>
          
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Capacity (Weight/Volume)</label>
            <div className="relative">
              <input required type="number" step="0.01" placeholder="25500" className="w-full p-2.5 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400" onChange={e => setFormData({...formData, capacity_kg: e.target.value})} />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">KG</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Odometer Reading</label>
            <div className="relative">
              <input required type="number" step="0.01" value={formData.current_odometer_km} className="w-full p-2.5 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm text-gray-700" onChange={e => setFormData({...formData, current_odometer_km: e.target.value})} />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">KM</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Acquisition Cost</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <span className="text-sm font-bold text-gray-400">$</span>
              </div>
              <input type="number" step="0.01" placeholder="0.00" className="w-full p-2.5 pl-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400" onChange={e => setFormData({...formData, purchase_cost: e.target.value})} />
            </div>
          </div>

          <div className="col-span-2 mt-4 pt-5 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 text-sm bg-[#1C5B3E] hover:bg-[#154630] text-white font-medium rounded-lg transition-colors shadow-sm">
              Save Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;