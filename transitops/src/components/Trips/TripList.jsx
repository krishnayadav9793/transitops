import React, { useEffect, useState } from 'react';
import { getTrips, updateTripStatus } from '../../api/trips';
import TripForm from './TripForm';

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

  const handleStatusChange = async (id, status, payload = {}) => {
    await updateTripStatus(id, { status, ...payload });
    setModalData(null);
    fetchTrips();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trip Management</h1>
        <button onClick={() => setShowForm(true)} className="bg-green-700 text-white px-4 py-2 rounded-md">
          Create New Trip
        </button>
      </div>

      {showForm && <TripForm onClose={() => setShowForm(false)} onSuccess={fetchTrips} />}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle/Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trips.map(trip => (
              <tr key={trip.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{trip.source_location} &rarr; {trip.destination}</div>
                  <div className="text-sm text-gray-500">{trip.planned_distance} KM | {trip.cargo_weight} TONNES</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${trip.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 
                      trip.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : 
                      trip.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {trip.vehicles?.registration_number} <br/> {trip.drivers?.name}
                </td>
                <td className="px-6 py-4 text-sm font-medium flex gap-2">
                  {trip.status === 'Draft' && (
                    <button onClick={() => handleStatusChange(trip.id, 'Dispatched')} className="text-blue-600 hover:text-blue-900 font-semibold">Dispatch</button>
                  )}
                  {trip.status === 'Dispatched' && (
                    <button onClick={() => setModalData(trip)} className="text-green-600 hover:text-green-900 font-semibold">Complete</button>
                  )}
                  {(trip.status === 'Draft' || trip.status === 'Dispatched') && (
                    <button onClick={() => handleStatusChange(trip.id, 'Cancelled')} className="text-red-600 hover:text-red-900 font-semibold">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalData && (
        <CompleteModal 
          trip={modalData} 
          onClose={() => setModalData(null)} 
          onSubmit={(payload) => handleStatusChange(modalData.id, 'Completed', payload)} 
        />
      )}
    </div>
  );
};

const CompleteModal = ({ trip, onClose, onSubmit }) => {
  const [odometer, setOdometer] = useState('');
  const [fuel, setFuel] = useState('');

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Complete Trip</h3>
        <input required type="number" placeholder="Final Odometer Reading (KM)" value={odometer} onChange={(e) => setOdometer(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <input required type="number" placeholder="Fuel Consumed (Liters)" value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
          <button onClick={() => onSubmit({ final_odometer: odometer, fuel_consumed: fuel })} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default TripList;