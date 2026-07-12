import React, { useState, useEffect } from 'react';
import { createTrip, getResources } from '../../api/trips';

const TripFormModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    source: '', destination: '', cargo_weight_kg: '', estimated_distance_km: '', vehicle_id: '', driver_id: ''
  });
  const [resources, setResources] = useState({ vehicles: [], drivers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getResources()
      .then((data) => setResources(data))
      .catch(() => setError('Failed to load available vehicles and drivers'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrip(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create trip');
    }
  };

  return (
    <div
      style={{ backgroundColor: 'rgba(17,24,39,0.4)' }}
      className="fixed inset-0 backdrop-blur-sm overflow-y-auto w-full h-full flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full mx-4" style={{ maxWidth: '680px' }}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-[#1C5B3E] p-2.5 rounded-xl text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add New Trip</h3>
              <p className="text-xs text-gray-500">Register a new trip in the TransitOps network.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section: Route */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Route Information</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Source Location</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Central Warehouse"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all placeholder-gray-300"
                  onChange={e => setFormData({...formData, source: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Destination</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. North Hub"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all placeholder-gray-300"
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cargo Weight</label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="5000"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all placeholder-gray-300"
                    onChange={e => setFormData({...formData, cargo_weight_kg: e.target.value})}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">KG</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estimated Distance</label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="350.5"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all placeholder-gray-300"
                    onChange={e => setFormData({...formData, estimated_distance_km: e.target.value})}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">KM</span>
                </div>
              </div>
            </div>

            {/* Section: Assignment */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Asset Assignment</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Assign Vehicle
                  {loading && <span className="ml-1 text-[10px] font-normal text-gray-400">Loading...</span>}
                  {!loading && resources.vehicles?.length === 0 && <span className="ml-1 text-[10px] text-orange-500">None available</span>}
                </label>
                <select
                  required
                  disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-gray-700"
                  onChange={e => setFormData({...formData, vehicle_id: e.target.value})}
                >
                  <option value="">Select vehicle</option>
                  {resources.vehicles?.map(v => (
                    <option key={v.vehicle_id} value={v.vehicle_id}>
                      {v.registration_number}{v.model ? ` — ${v.model}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Assign Driver
                  {loading && <span className="ml-1 text-[10px] font-normal text-gray-400">Loading...</span>}
                  {!loading && resources.drivers?.length === 0 && <span className="ml-1 text-[10px] text-orange-500">None available</span>}
                </label>
                <select
                  required
                  disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-gray-700"
                  onChange={e => setFormData({...formData, driver_id: e.target.value})}
                >
                  <option value="">Select driver</option>
                  {resources.drivers?.map(d => (
                    <option key={d.driver_id} value={d.driver_id}>
                      {d.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-sm bg-[#1C5B3E] hover:bg-[#154630] text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Save Trip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripFormModal;