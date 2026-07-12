import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrip } from '../../api/trips';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    getTrip(id)
      .then(res => setTrip(res.data))
      .catch(console.error);
  }, [id]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1C5B3E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const status = trip.trip_statuses?.status_name;
  const assignment = trip.trip_assignments?.[0] || {};

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#F9FAFB] min-h-screen font-sans">
       <div className="flex items-center gap-4 mb-8">
         <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
         </button>
         <div>
           <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{trip.trip_number}</h1>
             <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-md uppercase tracking-wide
                    ${status === 'DRAFT' ? 'bg-gray-100 text-gray-600' : 
                      status === 'DISPATCHED' ? 'bg-orange-50 text-orange-700' : 
                      status === 'ONGOING' ? 'bg-blue-50 text-blue-700' :
                      status === 'COMPLETED' ? 'bg-[#E5F0E8] text-[#1C5B3E]' : 'bg-red-50 text-red-700'}`}>
                {status}
             </span>
           </div>
           <p className="text-gray-500 text-sm mt-1">Created on {new Date(trip.created_at).toLocaleDateString()}</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         {/* Route Information */}
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Logistics & Route</h3>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Origin</p>
                    <p className="font-bold text-gray-900">{trip.source}</p>
                </div>
                <div className="flex-1 px-4 flex items-center justify-center">
                    <div className="w-full h-px bg-gray-200 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Destination</p>
                    <p className="font-bold text-gray-900">{trip.destination}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Cargo Weight</p>
                    <p className="text-lg font-bold text-gray-900">{trip.cargo_weight_kg} <span className="text-xs text-gray-500 font-medium">KG</span></p>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Est. Distance</p>
                    <p className="text-lg font-bold text-gray-900">{trip.estimated_distance_km} <span className="text-xs text-gray-500 font-medium">KM</span></p>
                </div>
            </div>
         </div>

         {/* Assignment Information */}
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Asset Assignment</h3>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-[#E5F0E8] p-3 rounded-lg text-[#1C5B3E]">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"></path></svg>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Assigned Vehicle</p>
                        <p className="font-bold text-gray-900">{assignment.vehicles?.registration_number || 'Unassigned'}</p>
                        {assignment.vehicles && <p className="text-xs text-gray-500 mt-0.5">{assignment.vehicles.vehicle_name}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Assigned Driver</p>
                        <p className="font-bold text-gray-900">{assignment.drivers?.full_name || 'Unassigned'}</p>
                        {assignment.drivers && <p className="text-xs text-gray-500 mt-0.5">{assignment.drivers.email}</p>}
                    </div>
                </div>
            </div>
         </div>
       </div>

       {/* Execution Execution Metrics */}
       {(status === 'COMPLETED' || status === 'ONGOING') && (
       <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
         <div className="px-6 py-5 border-b border-gray-100 bg-[#F3F4F6]">
           <h2 className="text-lg font-bold text-gray-900 tracking-tight">Execution Metrics</h2>
         </div>
         <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-8">
           <div>
             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Actual Start Time</p>
             <p className="text-sm font-medium text-gray-900">{trip.actual_start_time ? new Date(trip.actual_start_time).toLocaleString() : 'N/A'}</p>
           </div>
           <div>
             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Actual End Time</p>
             <p className="text-sm font-medium text-gray-900">{trip.actual_end_time ? new Date(trip.actual_end_time).toLocaleString() : 'N/A'}</p>
           </div>
           <div>
             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Final Odometer</p>
             <p className="text-sm font-medium text-gray-900">{trip.odometer_reading || '--'} KM</p>
           </div>
           <div>
             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Fuel Consumed</p>
             <p className="text-sm font-medium text-gray-900">{trip.fuel_quantity_liters || '--'} L</p>
           </div>
         </div>
       </div>
       )}
    </div>
  );
};

export default TripDetails;
