import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicle } from '../../api/fleet';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    getVehicle(id)
      .then(res => setVehicle(res.data))
      .catch(console.error);
  }, [id]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1C5B3E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
       <div className="flex items-center gap-4 mb-8">
         <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
         </button>
         <div>
           <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{vehicle.registration_number}</h1>
             <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-md uppercase tracking-wide ${getStatusStyle(vehicle.vehicle_statuses?.status_name)}`}>
                {vehicle.vehicle_statuses?.status_name}
             </span>
           </div>
           <p className="text-gray-500 text-sm mt-1">{vehicle.model} • {vehicle.vehicle_types?.type_name}</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-[#E5F0E8] p-3 rounded-xl text-[#1C5B3E]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Current Odometer</p>
              <p className="text-2xl font-bold text-gray-900">{vehicle.current_odometer_km} <span className="text-sm font-medium text-gray-500">KM</span></p>
            </div>
         </div>
         
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Load Capacity</p>
              <p className="text-2xl font-bold text-gray-900">{vehicle.capacity_kg} <span className="text-sm font-medium text-gray-500">KG</span></p>
            </div>
         </div>
         
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Acquisition Cost</p>
              <p className="text-2xl font-bold text-gray-900"><span className="text-lg text-gray-500 mr-1">$</span>{vehicle.purchase_cost}</p>
            </div>
         </div>
       </div>

       <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
         <div className="px-6 py-5 border-b border-gray-100 bg-[#F3F4F6]">
           <h2 className="text-lg font-bold text-gray-900 tracking-tight">Vehicle Specifications</h2>
         </div>
         <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-8">
           <div>
             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">System ID</p>
             <p className="text-sm font-medium text-gray-900">{vehicle.vehicle_id}</p>
           </div>
           <div>
             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Registration Date</p>
             <p className="text-sm font-medium text-gray-900">{new Date(vehicle.created_at).toLocaleDateString()}</p>
           </div>
           <div>
             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Asset Name</p>
             <p className="text-sm font-medium text-gray-900">{vehicle.vehicle_name || 'N/A'}</p>
           </div>
           <div>
             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Operating Region</p>
             <p className="text-sm font-medium text-gray-900">{vehicle.region_id || 'Global'}</p>
           </div>
         </div>
       </div>
    </div>
  );
};

export default VehicleDetails;