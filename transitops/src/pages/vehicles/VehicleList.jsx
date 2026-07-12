import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVehicles } from '../../api/fleet';
import VehicleForm from './VehicleForm';
import StatusBadge from '../../components/ui/StatusBadge';

const prettyStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getVehicles();
      setVehicles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve vehicle fleet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="space-y-lg">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Vehicle Registry</h2>
          <p className="text-on-surface-variant mt-1">Manage corporate fleet assets, load limits, and live maintenance status.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary-container text-white py-2.5 px-6 rounded-lg font-body-md text-body-md flex items-center gap-sm shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">directions_bus</span>
          <span>Add New Vehicle</span>
        </button>
      </div>

      {showForm && (
        <VehicleForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchVehicles}
        />
      )}

      {/* Fleet table container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
        {error && (
          <div className="p-md bg-error/10 text-error border-b border-error/20 font-body-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low z-10">
              <tr>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Registration</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Vehicle Details</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Vehicle Type</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Max Load</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Odometer Reading</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Acquisition Cost</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-lg py-8 text-center text-outline italic">
                    Loading vehicle assets...
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-lg py-8 text-center text-outline italic">
                    No vehicles registered in the fleet database.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => {
                  const status = v.vehicle_statuses?.status_name || 'AVAILABLE';
                  return (
                    <tr key={v.vehicle_id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                      
                      {/* Registration */}
                      <td className="px-lg py-md font-body-sm text-on-surface font-semibold">
                        <Link to={`/vehicles/${v.vehicle_id}`} className="hover:text-primary group-hover:text-primary transition-colors">
                          {v.registration_number}
                        </Link>
                      </td>

                      {/* Name / Model */}
                      <td className="px-lg py-md font-body-sm text-on-surface font-semibold">
                        {v.vehicle_name || v.model || 'Unnamed Vehicle'}
                      </td>

                      {/* Type */}
                      <td className="px-lg py-md font-body-sm text-on-surface-variant">
                        {v.vehicle_types?.type_name || 'General Fleet'}
                      </td>

                      {/* Capacity */}
                      <td className="px-lg py-md font-body-sm text-on-surface text-right font-semibold">
                        {Number(v.capacity_kg).toLocaleString()} kg
                      </td>

                      {/* Odometer */}
                      <td className="px-lg py-md font-body-sm text-on-surface text-right font-semibold">
                        {Number(v.current_odometer_km).toLocaleString()} km
                      </td>

                      {/* Cost */}
                      <td className="px-lg py-md font-body-sm text-on-surface text-right font-semibold">
                        ${Number(v.purchase_cost || 0).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-lg py-md">
                        <StatusBadge status={prettyStatus(status)} />
                      </td>

                      {/* Action details */}
                      <td className="px-lg py-md text-center">
                        <Link
                          to={`/vehicles/${v.vehicle_id}`}
                          className="px-md py-1.5 font-semibold text-primary hover:bg-primary/5 rounded-lg border border-primary/20 transition-all inline-block text-body-sm cursor-pointer"
                        >
                          View Details
                        </Link>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Counter footer */}
        <div className="px-lg py-md bg-surface-container-low border-t border-surface-container flex justify-between items-center">
          <span className="font-body-sm text-on-surface-variant">
            Total of {vehicles.length} assets registered in fleet network.
          </span>
        </div>
      </div>

    </div>
  );
};

export default VehicleList;