import React, { useState, useEffect } from 'react';
import { createTrip, getResources } from '../../api/trips';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';

const TripFormModal = ({ onClose, onSuccess }) => {
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role || 'Guest';

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    cargo_weight_kg: '',
    estimated_distance_km: '',
    vehicle_id: '',
    driver_id: ''
  });
  
  const [resources, setResources] = useState({ vehicles: [], drivers: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only load eligible assets list if the user is a dispatcher, manager, or admin
    if (userRole !== 'User') {
      getResources()
        .then((data) => setResources(data || { vehicles: [], drivers: [] }))
        .catch(() => toast.error('Failed to retrieve vehicle/driver resources.'));
    }
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadToast = toast.loading(
      userRole === 'User' 
        ? 'Finding suitable vehicle & driver matching cargo weights...' 
        : 'Registering new trip sheets...'
    );

    try {
      const payload = {
        source: formData.source,
        destination: formData.destination,
        cargo_weight_kg: Number(formData.cargo_weight_kg),
        estimated_distance_km: Number(formData.estimated_distance_km),
        vehicle_id: userRole === 'User' ? null : formData.vehicle_id,
        driver_id: userRole === 'User' ? null : formData.driver_id,
      };

      await createTrip(payload);
      toast.success(
        userRole === 'User'
          ? 'Trip requested! Matching driver has been notified.'
          : 'Trip created successfully!',
        { id: loadToast }
      );
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch trip requests.', { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 w-[500px] max-w-full shadow-2xl rounded-2xl relative my-8 shrink-0">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#1C5B3E] p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              {userRole === 'User' ? 'Request New Delivery' : 'Add New Trip'}
            </h3>
            <p className="text-sm text-gray-500">
              {userRole === 'User' 
                ? 'Fill details to match with a carrier instantly.' 
                : 'Register a dispatcher log sheet manually.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Source Location
              </label>
              <input
                id="source"
                required
                type="text"
                placeholder="e.g. Dallas Hub"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400 bg-white"
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Destination Location
              </label>
              <input
                id="destination"
                required
                type="text"
                placeholder="e.g. Austin Port"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400 bg-white"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Cargo Weight (KG)
              </label>
              <input
                id="weight"
                required
                type="number"
                step="0.01"
                placeholder="e.g. 1500"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400 bg-white"
                value={formData.cargo_weight_kg}
                onChange={e => setFormData({ ...formData, cargo_weight_kg: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Planned Distance (KM)
              </label>
              <input
                id="distance"
                required
                type="number"
                step="0.01"
                placeholder="e.g. 350.5"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm placeholder-gray-400 bg-white"
                value={formData.estimated_distance_km}
                onChange={e => setFormData({ ...formData, estimated_distance_km: e.target.value })}
              />
            </div>
          </div>

          {/* Asset Allocation dropdowns - Only display for managers, dispatchers or admins */}
          {userRole !== 'User' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Assign Vehicle
                </label>
                <select
                  id="vehicle"
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm bg-white cursor-pointer appearance-none"
                  value={formData.vehicle_id}
                  onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                >
                  <option value="">Select available vehicle</option>
                  {resources.vehicles.map(v => (
                    <option key={v.vehicle_id} value={v.vehicle_id}>
                      {v.registration_number} ({v.capacity_kg} kg max)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Assign Driver
                </label>
                <select
                  id="driver"
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm bg-white cursor-pointer appearance-none"
                  value={formData.driver_id}
                  onChange={e => setFormData({ ...formData, driver_id: e.target.value })}
                >
                  <option value="">Select available driver</option>
                  {resources.drivers.map(d => (
                    <option key={d.driver_id} value={d.driver_id}>
                      {d.full_name} (Score: {d.safety_score})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 font-semibold text-body-sm text-on-surface-variant hover:bg-surface-container rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 font-semibold text-body-sm bg-primary text-on-primary hover:bg-primary-container rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : userRole === 'User' ? 'Submit Request' : 'Create Trip'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TripFormModal;