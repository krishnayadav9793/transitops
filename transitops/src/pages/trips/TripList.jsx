import React, { useEffect, useState } from 'react';
import { getTrips, dispatchTrip, completeTrip, cancelTrip } from '../../api/trips';
import TripFormModal from './TripFormModal';
import TripCompleteModal from './TripCompleteModal';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchTrips = async () => {
    const { data } = await getTrips();
    setTrips(data);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDispatch = async (id) => {
    await dispatchTrip(id);
    fetchTrips();
  };

  const handleComplete = async (id, payload) => {
    await completeTrip(id, payload);
    setModalData(null);
    fetchTrips();
  };

  const handleCancel = async (id) => {
    await cancelTrip(id);
    fetchTrips();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#F9FAFB] min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Trip Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and monitor fleet operations and assignments</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-[#1C5B3E] hover:bg-[#154630] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
          <span className="text-lg leading-none">+</span> Add New Trip
        </button>
      </div>

      {showForm && <TripFormModal onClose={() => setShowForm(false)} onSuccess={fetchTrips} />}

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-[#F3F4F6]">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Trip ID / Route</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Cargo & Distance</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Assignment</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {trips?.map(trip => {
              const status = trip.trip_statuses?.status_name;
              const assignment = trip.trip_assignments?.[0] || {};
              return (
              <tr key={trip.trip_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">{trip.trip_number}</div>
                  <div className="text-[13px] text-gray-500 mt-0.5">{trip.source} &rarr; {trip.destination}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{trip.cargo_weight_kg} kg</div>
                  <div className="text-[13px] text-gray-500">{trip.estimated_distance_km} km</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 inline-flex text-[11px] font-bold rounded-md uppercase tracking-wide
                    ${status === 'DRAFT' ? 'bg-gray-100 text-gray-600' : 
                      status === 'DISPATCHED' ? 'bg-orange-50 text-orange-700' : 
                      status === 'ONGOING' ? 'bg-blue-50 text-blue-700' :
                      status === 'COMPLETED' ? 'bg-[#E5F0E8] text-[#1C5B3E]' : 'bg-red-50 text-red-700'}`}>
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{assignment.vehicles?.registration_number || 'Unassigned'}</div>
                  <div className="text-[13px] text-gray-500">{assignment.drivers?.full_name || '-'}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex gap-4">
                    {status === 'DRAFT' && (
                      <button onClick={() => handleDispatch(trip.trip_id)} className="text-[#1C5B3E] hover:text-[#154630] font-semibold transition-colors">Dispatch</button>
                    )}
                    {(status === 'DISPATCHED' || status === 'ONGOING') && (
                      <button onClick={() => setModalData(trip)} className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">Complete</button>
                    )}
                    {(status === 'DRAFT' || status === 'DISPATCHED') && (
                      <button onClick={() => handleCancel(trip.trip_id)} className="text-gray-400 hover:text-red-600 transition-colors">Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {modalData && (
        <TripCompleteModal 
          trip={modalData} 
          onClose={() => setModalData(null)} 
          onSubmit={(payload) => handleComplete(modalData.trip_id, payload)} 
        />
      )}
    </div>
  );
};

export default TripList;