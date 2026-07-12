import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import StatusBadge from '../../components/ui/StatusBadge';
import DriverFormModal from './DriverFormModal';

const prettyStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export const DriverProfile = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit modal trigger
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDriverProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get(`/drivers/${id}`);
      setDriver(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve driver profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="p-xl text-center text-outline italic">
        Loading driver profile details...
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="p-xl bg-error/10 text-error rounded-xl border border-error/20 flex flex-col items-center gap-md">
        <p className="font-bold">{error || 'Driver profile not found.'}</p>
        <Link to="/drivers" className="bg-primary text-on-primary px-xl py-sm rounded-lg font-bold">
          Return to Registry
        </Link>
      </div>
    );
  }

  // Parse active vehicle and trip assignments
  const activeAssignment = driver.trip_assignments?.find((ta) => ta.is_active);
  const vehicle = activeAssignment?.vehicles;

  const kpiData = [
    { label: 'Safety Score', value: Number(driver.safety_score).toFixed(0), color: 'text-primary', border: 'border-l-4 border-primary' },
    { label: 'Joining Date', value: driver.joining_date ? new Date(driver.joining_date).toLocaleDateString() : 'N/A', color: 'text-secondary', border: 'border-l-4 border-secondary' },
    { label: 'License Class', value: driver.license_categories?.category_code || 'N/A', color: 'text-primary-container', border: 'border-l-4 border-primary-container' },
    { label: 'Active Assignment', value: vehicle ? 'On Trip' : 'Available', color: vehicle ? 'text-primary' : 'text-outline', border: 'border-l-4 border-outline' },
  ];

  const personalInfo = [
    { label: 'Employee ID', value: `DRV-${driver.driver_id}` },
    { label: 'Phone Number', value: driver.phone },
    { label: 'Email Address', value: driver.email || 'N/A' },
    { label: 'License Number', value: driver.license_number },
    { label: 'License Category', value: driver.license_categories?.category_name || 'N/A' },
    { label: 'License Expiry', value: new Date(driver.license_expiry_date).toLocaleDateString() },
    { label: 'Hire Date / Joining', value: driver.joining_date ? new Date(driver.joining_date).toLocaleDateString() : 'N/A' },
  ];

  return (
    <div className="space-y-xl">
      
      {/* Header Panel */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg bg-surface-container-lowest p-lg rounded-xl shadow-sm">
        <div className="flex items-center gap-lg">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1 rounded-lg border-4 border-surface-container-lowest">
              <span className="material-symbols-outlined text-sm">verified</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-md mb-xs">
              <h1 className="font-headline-lg text-headline-lg">{driver.full_name}</h1>
              <StatusBadge status={prettyStatus(driver.driver_statuses?.status_name)} />
            </div>
            <div className="flex flex-wrap gap-xl text-on-surface-variant">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-md">mail</span>
                <span className="font-body-md">{driver.email || 'No email registered'}</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-md">phone</span>
                <span className="font-body-md">{driver.phone}</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-md">badge</span>
                <span className="font-body-md">Category: {driver.license_categories?.category_code || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-md">
          <button
            onClick={() => setModalOpen(true)}
            className="px-xl py-md bg-surface-variant text-on-surface-variant font-bold rounded-xl flex items-center gap-sm hover:bg-outline-variant transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined">edit</span>
            Edit Profile
          </button>
          <Link
            to="/drivers"
            className="px-xl py-md bg-surface-container text-on-surface font-bold rounded-xl flex items-center gap-sm hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Registry
          </Link>
        </div>
      </section>

      {/* KPI Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className={`bg-surface-container-lowest p-lg rounded-xl shadow-sm ${kpi.border}`}>
            <p className="text-outline font-label-caps uppercase mb-sm">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <h3 className={`font-kpi-lg text-kpi-lg ${kpi.color}`}>{kpi.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Detail Sections */}
      <div className="grid grid-cols-12 gap-lg">
        
        {/* Personal & Contract Information */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest p-lg rounded-xl shadow-sm space-y-lg">
          <h3 className="font-headline-sm text-headline-sm">Registry Profile Info</h3>
          <div className="space-y-md">
            {personalInfo.map((info) => (
              <div key={info.label} className="flex justify-between border-b border-surface-container pb-sm">
                <span className="text-outline font-body-sm">{info.label}</span>
                <span className="font-bold text-on-surface">{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Vehicle details */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest p-lg rounded-xl shadow-sm space-y-lg">
          <h3 className="font-headline-sm text-headline-sm">Current Transit Assignment</h3>
          {vehicle ? (
            <div className="p-lg border border-outline-variant/30 rounded-xl bg-surface-container-low/30 space-y-md">
              <div className="flex items-center gap-md">
                <div className="bg-primary/10 text-primary p-md rounded-xl">
                  <span className="material-symbols-outlined text-2xl">local_shipping</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">{vehicle.vehicle_name || 'Fleet Vehicle'}</h4>
                  <p className="text-outline font-body-sm">Registration: {vehicle.registration_number}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-body-sm pt-sm border-t border-outline-variant/20">
                <span className="text-outline">Assignment Status</span>
                <span className="bg-primary/15 text-primary px-sm py-xs rounded-full font-bold uppercase text-[10px]">Active Now</span>
              </div>
            </div>
          ) : (
            <div className="p-lg border border-dashed border-outline-variant/50 rounded-xl flex flex-col items-center justify-center text-center text-outline italic py-12">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline/30">no_transportation</span>
              No active trip assignments currently linked to this driver.
            </div>
          )}
        </div>

      </div>

      <DriverFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        driver={driver}
        onSaved={fetchDriverProfile}
      />
    </div>
  );
};

export default DriverProfile;
