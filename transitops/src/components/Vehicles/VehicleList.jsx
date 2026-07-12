import React, { useEffect, useState } from 'react';
import { getVehicles } from '../../api/fleet';
import VehicleForm from './VehicleForm';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchVehicles = async () => {
    const { data } = await getVehicles();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'ON_TRIP': return 'bg-blue-100 text-blue-800';
      case 'IN_SHOP': return 'bg-orange-100 text-orange-800';
      case 'RETIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-lg p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Vehicle Registry</h2>
          <p className="text-on-surface-variant mt-1">Manage fleet assets and real-time status.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-sm px-lg py-2 bg-primary text-on-primary rounded-lg font-body-sm font-bold shadow-sm hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Vehicle
        </button>
      </div>

      {showForm && <VehicleForm onClose={() => setShowForm(false)} onSuccess={fetchVehicles} />}

      <div className="bg-surface-container-lowest shadow-sm border border-outline-variant/30 rounded-xl overflow-hidden mt-6">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-outline-variant/50">
            <thead className="bg-surface-container">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Registration</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Model / Type</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Odometer (KM)</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Acquisition</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-on-surface uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 bg-surface-container-lowest">
              {vehicles.map((v) => (
                <tr key={v.vehicle_id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-on-surface">{v.registration_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-on-surface">{v.vehicle_name || v.model}</div>
                    <div className="text-[12px] text-on-surface-variant">{v.vehicle_types?.type_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">{v.capacity_kg} KG</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">{v.current_odometer_km}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface font-medium">${v.purchase_cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-[11px] font-bold rounded-md uppercase tracking-wide ${getStatusStyle(v.vehicle_statuses?.status_name)}`}>
                      {v.vehicle_statuses?.status_name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;