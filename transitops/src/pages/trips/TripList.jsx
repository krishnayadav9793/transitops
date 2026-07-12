import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTrips, dispatchTrip, cancelTrip } from '../../api/trips';
import TripFormModal from './TripFormModal';
import TripCompleteModal from './TripCompleteModal';
import StatusBadge from '../../components/ui/StatusBadge';

const prettyStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [showForm, setShowForm] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTrips();
      setTrips(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve trip entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDispatch = async (id) => {
    try {
      await dispatchTrip(id);
      fetchTrips();
    } catch (err) {
      alert(err.message || 'Failed to dispatch trip.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await cancelTrip(id);
      fetchTrips();
    } catch (err) {
      alert(err.message || 'Failed to cancel trip.');
    }
  };

  return (
    <div className="space-y-lg">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Trip Dispatch Management</h2>
          <p className="text-on-surface-variant mt-1">Organize routing, dispatch vehicles, and track assignment status.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary-container text-white py-2.5 px-6 rounded-lg font-body-md text-body-md flex items-center gap-sm shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">local_shipping</span>
          <span>Create New Trip</span>
        </button>
      </div>

      {/* Forms & Modals */}
      {showForm && (
        <TripFormModal
          onClose={() => setShowForm(false)}
          onSuccess={fetchTrips}
        />
      )}

      {/* Trips list container */}
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
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Trip Number</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Route Info</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Cargo Weight</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Est. Distance</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Vehicle ID</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Driver Name</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-lg py-8 text-center text-outline italic">
                    Loading trip sheets...
                  </td>
                </tr>
              ) : trips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-lg py-8 text-center text-outline italic">
                    No trips logged. Click "Create New Trip" to schedule one.
                  </td>
                </tr>
              ) : (
                trips.map((trip) => {
                  const status = trip.trip_statuses?.status_name || 'DRAFT';
                  const assignment = trip.trip_assignments?.[0] || {};
                  return (
                    <tr key={trip.trip_id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                      
                      {/* Trip Number */}
                      <td className="px-lg py-md font-body-sm text-on-surface font-semibold">
                        <Link to={`/trips/${trip.trip_id}`} className="hover:text-primary group-hover:text-primary transition-colors">
                          {trip.trip_number}
                        </Link>
                      </td>

                      {/* Source/Destination */}
                      <td className="px-lg py-md font-body-sm text-on-surface">
                        <div className="flex items-center gap-xs">
                          <span>{trip.source}</span>
                          <span className="material-symbols-outlined text-outline text-sm">arrow_forward</span>
                          <span>{trip.destination}</span>
                        </div>
                      </td>

                      {/* Cargo Weight */}
                      <td className="px-lg py-md font-body-sm text-on-surface text-right font-semibold">
                        {Number(trip.cargo_weight_kg).toLocaleString()} kg
                      </td>

                      {/* Distance */}
                      <td className="px-lg py-md font-body-sm text-on-surface text-right font-semibold">
                        {trip.estimated_distance_km} km
                      </td>

                      {/* Vehicle */}
                      <td className="px-lg py-md font-body-sm text-on-surface-variant font-bold">
                        {assignment.vehicles?.registration_number || <span className="text-outline/40 font-normal italic">-</span>}
                      </td>

                      {/* Driver */}
                      <td className="px-lg py-md font-body-sm text-on-surface">
                        {assignment.drivers?.full_name || <span className="text-outline/40 font-normal italic">-</span>}
                      </td>

                      {/* Status */}
                      <td className="px-lg py-md">
                        <StatusBadge status={prettyStatus(status)} />
                      </td>

                      {/* Actions */}
                      <td className="px-lg py-md text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-md">
                          {status === 'DRAFT' && (
                            <button
                              onClick={() => handleDispatch(trip.trip_id)}
                              className="px-sm py-xs font-semibold text-primary hover:bg-primary/5 rounded transition-all cursor-pointer"
                            >
                              Dispatch
                            </button>
                          )}
                          {(status === 'DRAFT' || status === 'DISPATCHED') && (
                            <button
                              onClick={() => handleCancel(trip.trip_id)}
                              className="px-sm py-xs font-semibold text-error hover:bg-error/5 rounded transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                          <Link
                            to={`/trips/${trip.trip_id}`}
                            className="px-sm py-xs font-semibold text-outline hover:bg-surface-container rounded transition-all inline-block"
                          >
                            Details
                          </Link>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Total counts footer */}
        <div className="px-lg py-md bg-surface-container-low border-t border-surface-container flex justify-between items-center">
          <span className="font-body-sm text-on-surface-variant">
            Total of {trips.length} active trips dispatched or scheduled.
          </span>
        </div>
      </div>

    </div>
  );
};

export default TripList;