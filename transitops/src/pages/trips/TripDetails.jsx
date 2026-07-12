import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTripById, dispatchTrip, completeTrip, cancelTrip } from '../../api/trips';
import StatusBadge from '../../components/ui/StatusBadge';
import TripCompleteModal from './TripCompleteModal';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';

export const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role || 'Guest';

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const fetchTrip = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTripById(id);
      setTrip(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve trip details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const handleAccept = async () => {
    const loadToast = toast.loading('Accepting trip request...');
    try {
      await dispatchTrip(id);
      toast.success('Trip accepted and dispatch started!', { id: loadToast });
      fetchTrip();
    } catch (err) {
      toast.error(err.message || 'Failed to accept trip.', { id: loadToast });
    }
  };

  const handleCompleteSubmit = async (payload) => {
    const loadToast = toast.loading('Filing completion details...');
    try {
      await completeTrip(id, {
        odometer_reading: Number(payload.odometer_reading),
        fuel_quantity_liters: Number(payload.fuel_quantity_liters)
      });
      toast.success('Trip completed successfully!', { id: loadToast });
      setShowCompleteModal(false);
      fetchTrip();
    } catch (err) {
      toast.error(err.message || 'Failed to complete trip.', { id: loadToast });
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this trip request? All resources will be released.')) return;
    const loadToast = toast.loading('Cancelling trip sheet...');
    try {
      await cancelTrip(id);
      toast.success('Trip cancelled and assets released.', { id: loadToast });
      fetchTrip();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel trip.', { id: loadToast });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-2xl text-outline italic animate-pulse">
        <span className="material-symbols-outlined text-4xl mb-sm animate-spin">sync</span>
        <span>Loading trip specifications...</span>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="p-xl bg-error/10 text-error rounded-3xl border border-error/20 flex flex-col items-center gap-md max-w-md mx-auto mt-2xl text-center">
        <span className="material-symbols-outlined text-4xl">error</span>
        <p className="font-semibold">{error || 'Trip details not found.'}</p>
        <Link to="/trips" className="bg-primary text-on-primary px-xl py-sm rounded-xl font-bold hover:bg-primary-container transition-all">
          Return to Dispatch Logs
        </Link>
      </div>
    );
  }

  const status = trip.trip_statuses?.status_name || 'DRAFT';
  const assignment = trip.trip_assignments?.[0] || {};
  const vehicle = assignment.vehicles || {};
  const driver = assignment.drivers || {};

  const steps = [
    { label: 'Requested (Draft)', active: true },
    { label: 'En Route (Dispatched)', active: status === 'DISPATCHED' || status === 'COMPLETED' },
    { label: 'Completed', active: status === 'COMPLETED' }
  ];

  return (
    <div className="space-y-xl">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center text-on-surface-variant text-body-sm mb-sm">
            <Link to="/trips" className="hover:text-primary transition-colors">Trips</Link>
            <span className="material-symbols-outlined text-[14px] mx-xs">chevron_right</span>
            <span className="text-on-surface font-medium">Trip #{trip.trip_number}</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-background flex items-center gap-md">
            Trip ID: {trip.trip_number}
            <StatusBadge status={status} />
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            Route: <span className="font-bold text-on-surface">{trip.source}</span> &rarr; <span className="font-bold text-on-surface">{trip.destination}</span>
          </p>
        </div>
        
        {/* Responsive Control Actions */}
        <div className="flex flex-wrap gap-md">
          {/* Driver Actions */}
          {userRole === 'Driver' && status === 'DRAFT' && (
            <button
              onClick={handleAccept}
              className="px-lg py-md bg-primary text-on-primary rounded-xl text-body-md font-bold shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer flex items-center gap-sm"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>Accept Request</span>
            </button>
          )}
          {userRole === 'Driver' && status === 'DISPATCHED' && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="px-lg py-md bg-primary text-on-primary rounded-xl text-body-md font-bold shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer flex items-center gap-sm"
            >
              <span className="material-symbols-outlined text-lg">done_all</span>
              <span>Complete Trip</span>
            </button>
          )}

          {/* User/Customer Cancellation Action */}
          {(userRole === 'User' || userRole === 'Admin' || userRole === 'Fleet Manager') && 
           (status === 'DRAFT' || status === 'DISPATCHED') && (
            <button
              onClick={handleCancel}
              className="px-lg py-md border border-error text-error rounded-xl text-body-md font-semibold hover:bg-error/5 transition-all cursor-pointer flex items-center gap-sm"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
              <span>Cancel Request</span>
            </button>
          )}
          
          <Link
            to="/trips"
            className="px-lg py-md border border-outline-variant rounded-xl text-body-md font-semibold bg-surface-container-lowest hover:bg-surface-container-low transition-all flex items-center"
          >
            Back to List
          </Link>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-sm border border-surface-container">
        <div className="flex items-center justify-between px-xl md:px-3xl">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center relative z-10 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-sm transition-all duration-300 ${
                  step.active
                    ? 'bg-primary text-on-primary ring-4 ring-primary/10 ring-offset-2 font-bold scale-105'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined">
                    {idx === 0 ? 'edit_note' : idx === 1 ? 'local_shipping' : 'flag'}
                  </span>
                </div>
                <span className={`font-label-caps uppercase text-[10px] md:text-xs tracking-wider ${step.active ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-grow h-1 mx-4 -mt-8 rounded transition-all duration-500 ${
                  idx === 0 && status !== 'DRAFT' 
                    ? 'bg-primary' 
                    : status === 'COMPLETED' 
                    ? 'bg-primary' 
                    : 'bg-surface-container-high'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Detail Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        
        {/* Route Specifications */}
        <section className="bg-surface-container-lowest rounded-2xl p-lg border border-surface-container space-y-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Route Specs</h3>
            <span className="material-symbols-outlined text-outline">map</span>
          </div>
          <div className="space-y-md">
            <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
              <span className="text-on-surface-variant font-medium">Estimated Distance</span>
              <span className="font-bold text-on-surface">{trip.estimated_distance_km} KM</span>
            </div>
            {trip.actual_distance_km && (
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-on-surface-variant font-medium">Actual Distance</span>
                <span className="font-bold text-primary">{trip.actual_distance_km} KM</span>
              </div>
            )}
            <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
              <span className="text-on-surface-variant font-medium">Cargo Payload</span>
              <span className="font-bold text-on-surface">{Number(trip.cargo_weight_kg).toLocaleString()} KG</span>
            </div>
            <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
              <span className="text-on-surface-variant font-medium">Scheduled Start</span>
              <span className="font-bold text-on-surface">
                {trip.actual_start_time ? new Date(trip.actual_start_time).toLocaleString() : 'Waiting for Driver acceptance'}
              </span>
            </div>
            {trip.actual_end_time && (
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-on-surface-variant font-medium">Completed Time</span>
                <span className="font-bold text-on-surface">{new Date(trip.actual_end_time).toLocaleString()}</span>
              </div>
            )}
          </div>
        </section>

        {/* Assigned Vehicle */}
        <section className="bg-surface-container-lowest rounded-2xl p-lg border border-surface-container space-y-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Assigned Carrier</h3>
            <span className="material-symbols-outlined text-outline">directions_bus</span>
          </div>
          {vehicle.registration_number ? (
            <div className="space-y-md">
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-on-surface-variant font-medium">Identifier / Registration</span>
                <span className="font-bold text-on-surface">{vehicle.registration_number}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-on-surface-variant font-medium">Maximum Load Capacity</span>
                <span className="font-bold text-on-surface">{Number(vehicle.capacity_kg).toLocaleString()} KG</span>
              </div>
              <div className="mt-lg p-sm bg-primary-fixed/20 rounded-xl flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-md">info</span>
                <span className="text-[11px] text-on-primary-fixed-variant font-semibold">Matched dynamically to weight.</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-xl text-center">
              <span className="material-symbols-outlined text-outline-variant text-4xl mb-sm">pending_actions</span>
              <p className="text-outline text-body-sm italic">Assigning suitable carrier...</p>
            </div>
          )}
        </section>

        {/* Assigned Driver */}
        <section className="bg-surface-container-lowest rounded-2xl p-lg border border-surface-container space-y-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Assigned Operator</h3>
            <span className="material-symbols-outlined text-outline">person</span>
          </div>
          {driver.full_name ? (
            <div className="space-y-md">
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-on-surface-variant font-medium">Driver Operator Name</span>
                <span className="font-bold text-on-surface">{driver.full_name}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-on-surface-variant font-medium">Contact Email</span>
                <span className="font-bold text-on-surface truncate max-w-[150px]">{driver.email || 'N/A'}</span>
              </div>
              <div className="mt-lg p-sm bg-primary-fixed/20 rounded-xl flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-md">shield</span>
                <span className="text-[11px] text-on-primary-fixed-variant font-semibold">ISO 27001 background checked</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-xl text-center">
              <span className="material-symbols-outlined text-outline-variant text-4xl mb-sm">pending_actions</span>
              <p className="text-outline text-body-sm italic">Matching driver operator...</p>
            </div>
          )}
        </section>

      </div>

      {showCompleteModal && (
        <TripCompleteModal
          trip={trip}
          onClose={() => setShowCompleteModal(false)}
          onSubmit={handleCompleteSubmit}
        />
      )}

    </div>
  );
};

export default TripDetails;
