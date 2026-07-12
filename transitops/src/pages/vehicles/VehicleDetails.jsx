import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVehicleById } from '../../api/fleet';
import { apiClient } from '../../services/apiClient';
import StatusBadge from '../../components/ui/StatusBadge';

const prettyStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const vData = await getVehicleById(id);
        setVehicle(vData);

        // Fetch maintenance history and filter for this vehicle
        const mData = await apiClient.get('/maintenance');
        const vehicleMaint = (mData || []).filter((m) => m.vehicle_id === Number(id));
        setMaintenance(vehicleMaint);
      } catch (err) {
        setError(err.message || 'Failed to load vehicle details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="p-xl text-center text-outline italic">
        Loading asset sheet...
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="p-xl bg-error/10 text-error rounded-xl border border-error/20 flex flex-col items-center gap-md">
        <p className="font-bold">{error || 'Vehicle asset details not found.'}</p>
        <Link to="/vehicles" className="bg-primary text-on-primary px-xl py-sm rounded-lg font-bold">
          Return to Registry
        </Link>
      </div>
    );
  }

  const statusName = vehicle.vehicle_statuses?.status_name || 'AVAILABLE';

  return (
    <div className="space-y-xl">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center text-on-surface-variant text-body-sm mb-sm">
            <Link to="/vehicles" className="hover:text-primary">Registry</Link>
            <span className="material-symbols-outlined text-[14px] mx-xs">chevron_right</span>
            <span>Asset #{vehicle.registration_number}</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-background flex items-center gap-md">
            Plate: {vehicle.registration_number}
            <StatusBadge status={prettyStatus(statusName)} />
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            {vehicle.vehicle_name || vehicle.model || 'General Fleet Asset'}
          </p>
        </div>
        <Link
          to="/vehicles"
          className="px-lg py-md border border-outline-variant rounded-lg text-body-md font-medium bg-surface hover:bg-surface-container-low transition-colors flex items-center"
        >
          Back to Registry
        </Link>
      </div>

      {/* Grid Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        
        {/* Left: General tech sheet */}
        <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/10 space-y-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-lg border-b border-surface-container pb-sm">
              <h3 className="font-headline-sm text-headline-sm">Asset Technical Parameters</h3>
              <span className="material-symbols-outlined text-outline">engineering</span>
            </div>
            <div className="space-y-md">
              <div className="w-full h-36 rounded-lg overflow-hidden bg-surface-container flex items-center justify-center text-outline mb-md">
                <span className="material-symbols-outlined text-5xl">directions_bus</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Model / Make</span>
                <span className="font-bold text-on-surface">{vehicle.model || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Classification</span>
                <span className="font-bold text-on-surface">{vehicle.vehicle_types?.type_name || 'General Fleet'}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Load Capacity limit</span>
                <span className="font-bold text-on-surface">{Number(vehicle.capacity_kg).toLocaleString()} KG</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                <span className="text-outline">Current Odometer</span>
                <span className="font-bold text-on-surface">{Number(vehicle.current_odometer_km).toLocaleString()} KM</span>
              </div>
            </div>
          </div>
        </section>

        {/* Center: Financial details */}
        <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/10 space-y-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-surface-container pb-sm">
            <h3 className="font-headline-sm text-headline-sm">Acquisition Summary</h3>
            <span className="material-symbols-outlined text-outline">payments</span>
          </div>
          <div className="space-y-md">
            <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
              <span className="text-outline">Purchase Price</span>
              <span className="font-bold text-on-surface">${Number(vehicle.purchase_cost || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
              <span className="text-outline">Acquisition Date</span>
              <span className="font-bold text-on-surface">{vehicle.created_at ? new Date(vehicle.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="p-md bg-primary-container/5 rounded-xl border border-primary-container/10 text-body-sm text-on-surface-variant leading-relaxed mt-lg">
              <span className="font-bold text-primary block mb-1">Fleet Compliance</span>
              This vehicle is actively monitored for safety inspections. Any outstanding mechanical logs must be closed prior to assignment.
            </div>
          </div>
        </section>

        {/* Right: Maintenance History logs list */}
        <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/10 space-y-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-surface-container pb-sm">
            <h3 className="font-headline-sm text-headline-sm">Service History</h3>
            <span className="material-symbols-outlined text-outline">calendar_today</span>
          </div>
          {maintenance.length === 0 ? (
            <p className="text-outline text-body-sm italic text-center py-10">No maintenance tasks recorded for this vehicle.</p>
          ) : (
            <div className="space-y-md max-h-[350px] overflow-y-auto pr-xs">
              {maintenance.map((m) => (
                <div key={m.maintenance_id} className="p-md border border-outline-variant/40 rounded-xl space-y-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-body-sm">#MNT-{m.maintenance_id}</span>
                    <span className="text-[10px] text-outline">{m.start_date ? new Date(m.start_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant font-semibold">
                    {prettyStatus(m.maintenance_types?.type_name)}
                  </p>
                  <p className="text-[11px] text-outline truncate" title={m.problem_description}>
                    {m.problem_description}
                  </p>
                  <div className="flex justify-between items-center pt-xs border-t border-surface-container">
                    <span className="text-[10px] font-bold text-primary">${Number(m.actual_cost || m.estimated_cost || 0).toLocaleString()}</span>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                      {m.maintenance_statuses?.status_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

    </div>
  );
};

export default VehicleDetails;
