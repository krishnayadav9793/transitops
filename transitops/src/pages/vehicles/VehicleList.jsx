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
      case 'AVAILABLE': return 'bg-[#E5F0E8] text-[#1C5B3E]';
      case 'ON_TRIP': return 'bg-blue-50 text-blue-700';
      case 'IN_SHOP': return 'bg-orange-50 text-orange-700';
      case 'RETIRED': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#F9FAFB] min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vehicle Registry</h1>
          <p className="text-gray-500 text-sm mt-1">Manage fleet assets and real-time status.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-[#1C5B3E] hover:bg-[#154630] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
          <span className="text-lg leading-none">+</span> Add Vehicle
        </button>
      </div>

      {showForm && <VehicleForm onClose={() => setShowForm(false)} onSuccess={fetchVehicles} />}

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#F3F4F6]">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Registration</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Model / Type</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Odometer (KM)</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Acquisition</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {vehicles.map((v) => (
                <tr key={v.vehicle_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{v.registration_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{v.vehicle_name || v.model}</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">{v.vehicle_types?.type_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{v.capacity_kg} KG</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{v.current_odometer_km}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">${v.purchase_cost}</td>
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