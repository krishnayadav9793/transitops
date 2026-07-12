import React, { useState, useEffect } from 'react';
import { createTrip, getResources } from '../../api/trips';

const TripFormModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    source: '', destination: '', cargo_weight_kg: '', estimated_distance_km: '', vehicle_id: '', driver_id: ''
  });
  const [resources, setResources] = useState({ vehicles: [], drivers: [] });

  useEffect(() => {
    getResources().then((data) => setResources(data || { vehicles: [], drivers: [] }));
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTrip(formData);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="p-8 w-full max-w-2xl shadow-2xl rounded-2xl bg-white relative my-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#1C5B3E] p-2.5 rounded-xl text-white shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Add New Trip</h3>
            <p className="text-sm text-gray-500">Register a new trip in the TransitOps network.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Source Location</label>
            <input required type="text" placeholder="e.g. Central Warehouse" className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400" onChange={e => setFormData({...formData, source: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Destination</label>
            <input required type="text" placeholder="e.g. North Hub" className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400" onChange={e => setFormData({...formData, destination: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cargo Weight (KG)</label>
            <input required type="number" step="0.01" placeholder="e.g. 5000" className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400" onChange={e => setFormData({...formData, cargo_weight_kg: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Estimated Distance (KM)</label>
            <input required type="number" step="0.01" placeholder="e.g. 350.5" className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400" onChange={e => setFormData({...formData, estimated_distance_km: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assign Vehicle</label>
            <select required className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm bg-white" onChange={e => setFormData({...formData, vehicle_id: e.target.value})}>
              <option value="">Select available vehicle</option>
              {resources.vehicles.map(v => <option key={v.vehicle_id} value={v.vehicle_id}>{v.registration_number}</option>)}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assign Driver</label>
            <select required className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm bg-white" onChange={e => setFormData({...formData, driver_id: e.target.value})}>
              <option value="">Select available driver</option>
              {resources.drivers.map(d => <option key={d.driver_id} value={d.driver_id}>{d.full_name}</option>)}
            </select>
          </div>
          
          <div className="col-span-2 mt-4 pt-5 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 text-sm bg-[#1C5B3E] hover:bg-[#154630] text-white font-medium rounded-lg transition-colors shadow-sm">Save Trip</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripFormModal;