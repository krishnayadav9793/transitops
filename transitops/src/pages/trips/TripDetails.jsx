import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTripById, dispatchTrip, completeTrip, cancelTrip } from '../../api/trips';
import StatusBadge from '../../components/ui/StatusBadge';
import TripCompleteModal from './TripCompleteModal';

export const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleDispatch = async () => {
    try {
      await dispatchTrip(id);
      fetchTrip();
    } catch (err) {
      alert(err.message || 'Failed to dispatch trip.');
    }
  };

  const handleCompleteSubmit = async (payload) => {
    try {
      await completeTrip(id, {
        odometer_reading: Number(payload.odometer_reading),
        fuel_quantity_liters: Number(payload.fuel_quantity_liters)
      });
      setShowCompleteModal(false);
      fetchTrip();
    } catch (err) {
      alert(err.message || 'Failed to complete trip.');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this trip? All resources will be released.')) return;
    try {
      await cancelTrip(id);
      fetchTrip();
    } catch (err) {
      alert(err.message || 'Failed to cancel trip.');
    }
  };

  if (loading) {
    return (
      <div className="p-xl text-center text-outline italic">
        Loading trip details...
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="p-xl bg-error/10 text-error rounded-xl border border-error/20 flex flex-col items-center gap-md">
        <p className="font-bold">{error || 'Trip details not found.'}</p>
        <Link to="/trips" className="bg-primary text-on-primary px-xl py-sm rounded-lg font-bold">
          Return to Trips list
        </Link>
      </div>
    );
  }

  const status = trip.trip_statuses?.status_name || 'DRAFT';
  const assignment = trip.trip_assignments?.[0] || {};
  const vehicle = assignment.vehicles || {};
  const driver = assignment.drivers || {};

  const steps = [
    { label: 'Draft Created', active: true },
    { label: 'Dispatched / Active', active: status === 'DISPATCHED' || status === 'COMPLETED' },
    { label: 'Completed / Closed', active: status === 'COMPLETED' }
  ];

  return (
    <div className="space-y-xl">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center text-on-surface-variant text-body-sm mb-sm">
            <Link to="/trips" className="hover:text-primary">Trips</Link>
            <span className="material-symbols-outlined text-[14px] mx-xs">chevron_right</span>
            <span>Trip #{trip.trip_number}</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-background flex items-center gap-md">
            Trip ID: {trip.trip_number}
            <StatusBadge status={status} />
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            Route: {trip.source} &rarr; {trip.destination}
          </p>
        </div>
        <div className="flex gap-md">
          {status === 'DRAFT' && (
            <button
              onClick={handleDispatch}
              className="px-lg py-md bg-primary text-on-primary rounded-lg text-body-md font-bold shadow-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-sm"
            >
              <span className="material-symbols-outlined text-lg">local_shipping</span>
              <span>Dispatch Trip</span>
            </button>
          )}
          {status === 'DISPATCHED' && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="px-lg py-md bg-primary text-on-primary rounded-lg text-body-md font-bold shadow-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-sm"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>Complete Trip</span>
            </button>
          )}
          {(status === 'DRAFT' || status === 'DISPATCHED') && (
            <button
              onClick={handleCancel}
              className="px-lg py-md border border-error text-error rounded-lg text-body-md font-medium hover:bg-error/5 transition-colors cursor-pointer flex items-center gap-sm"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
              <span>Cancel Trip</span>
            </button>
          )}
          <Link
            to="/trips"
            className="px-lg py-md border border-outline-variant rounded-lg text-body-md font-medium bg-surface hover:bg-surface-container-low transition-colors flex items-center"
          >
            Back to List
          </Link>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10">
        <div className="flex items-center justify-between px-xl md:px-3xl">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center relative z-10 text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-sm ${
                  step.active
                    ? 'bg-primary text-on-primary ring-4 ring-primary/10 ring-offset-2'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined">
                    {idx === 0 ? 'edit_note' : idx === 1 ? 'local_shipping' : 'flag'}
                  </span>
                </div>
                <span className={`font-label-caps uppercase text-[10px] md:text-xs ${step.active ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-grow h-1 mx-4 -mt-6 ${idx === 0 && status !== 'DRAFT' ? 'bg-primary' : status === 'COMPLETED' ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Detail Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        
        {/* Left: General info */}
        <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/10 space-y-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-surface-container pb-sm">
            <h3 className="font-headline-sm text-headline-sm">Route Specifications</h3>
            <span className="material-symbols-outlined text-outline">map</span>
          </div>
          <div className="space-y-md">
            <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
              <span className="text-outline">Estimated Distance</span>
              <span className="font-bold text-on-surface">{trip.estimated_distance_km} KM</span>
            </div>
            {trip.actual_distance_km && (
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Actual Distance</span>
                <span className="font-bold text-primary">{trip.actual_distance_km} KM</span>
              </div>
            )}
            <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
              <span className="text-outline">Cargo Payload</span>
              <span className="font-bold text-on-surface">{Number(trip.cargo_weight_kg).toLocaleString()} KG</span>
            </div>
            <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
              <span className="text-outline">Scheduled Start</span>
              <span className="font-bold text-on-surface">{trip.actual_start_time ? new Date(trip.actual_start_time).toLocaleString() : 'Pending Dispatch'}</span>
            </div>
            {trip.actual_end_time && (
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Completed End Time</span>
                <span className="font-bold text-on-surface">{new Date(trip.actual_end_time).toLocaleString()}</span>
              </div>
            )}
          </div>
        </section>

        {/* Center: Vehicle Assignment */}
        <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/10 space-y-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-surface-container pb-sm">
            <h3 className="font-headline-sm text-headline-sm">Vehicle Assignment</h3>
            <span className="material-symbols-outlined text-outline">directions_bus</span>
          </div>
          {vehicle.vehicle_id ? (
            <div className="space-y-md">
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Model Name</span>
                <span className="font-bold text-on-surface">{vehicle.vehicle_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Registration</span>
                <span className="font-bold text-on-surface">{vehicle.registration_number}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Max Capacity</span>
                <span className="font-bold text-on-surface">{Number(vehicle.max_load_capacity_kg).toLocaleString()} KG</span>
              </div>
            </div>
          ) : (
            <p className="text-outline text-body-sm italic text-center py-6">No vehicle assigned to this trip.</p>
          )}
        </section>

        {/* Right: Driver Assignment */}
        <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/10 space-y-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-surface-container pb-sm">
            <h3 className="font-headline-sm text-headline-sm">Driver Assignment</h3>
            <span className="material-symbols-outlined text-outline">person</span>
          </div>
          {driver.driver_id ? (
            <div className="space-y-md">
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Driver Name</span>
                <span className="font-bold text-on-surface">{driver.full_name}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">License Class</span>
                <span className="font-bold text-on-surface">{driver.license_number}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Phone Contact</span>
                <span className="font-bold text-on-surface">{driver.phone || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <p className="text-outline text-body-sm italic text-center py-6">No driver assigned to this trip.</p>
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
