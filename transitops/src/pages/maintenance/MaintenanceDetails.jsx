import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import StatusBadge from '../../components/ui/StatusBadge';

const prettyStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export const MaintenanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecord = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get(`/maintenance/${id}`);
      setRecord(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve maintenance details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const handleCloseJob = async () => {
    const cost = window.prompt('Enter actual service cost (USD):', String(record.estimated_cost || '250.00'));
    if (cost === null) return;
    if (isNaN(Number(cost)) || Number(cost) < 0) {
      return alert('Please enter a valid amount.');
    }

    try {
      await apiClient.put(`/maintenance/${id}/close`, {
        actual_cost: Number(cost),
        actual_completion_date: new Date().toISOString().split('T')[0]
      });
      fetchRecord();
    } catch (err) {
      alert(err.message || 'Failed to close maintenance log.');
    }
  };

  if (loading) {
    return (
      <div className="p-xl text-center text-outline italic">
        Loading maintenance record details...
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="p-xl bg-error/10 text-error rounded-xl border border-error/20 flex flex-col items-center gap-md">
        <p className="font-bold">{error || 'Maintenance log details not found.'}</p>
        <Link to="/maintenance" className="bg-primary text-on-primary px-xl py-sm rounded-lg font-bold">
          Return to Logs
        </Link>
      </div>
    );
  }

  const statusName = record.maintenance_statuses?.status_name || 'PENDING';
  
  const stepNodes = [
    { label: 'Pending / Reported', active: statusName === 'PENDING' || statusName === 'IN_PROGRESS' || statusName === 'COMPLETED' },
    { label: 'In Progress / Active', active: statusName === 'IN_PROGRESS' || statusName === 'COMPLETED' },
    { label: 'Completed / Closed', active: statusName === 'COMPLETED' }
  ];

  const financialDetails = [
    { label: 'Estimated Cost Budget', value: `$${Number(record.estimated_cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { label: 'Actual Invoiced Cost', value: record.actual_cost ? `$${Number(record.actual_cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Not Invoiced Yet' },
  ];

  const serviceTimeline = [
    { label: 'Start Date Logged', value: record.start_date ? new Date(record.start_date).toLocaleDateString() : 'N/A' },
    { label: 'Expected Completion', value: record.expected_completion_date ? new Date(record.expected_completion_date).toLocaleDateString() : 'N/A' },
    { label: 'Actual Completion', value: record.actual_completion_date ? new Date(record.actual_completion_date).toLocaleDateString() : 'Not Finished' },
  ];

  return (
    <div className="space-y-xl">
      
      {/* Navigation Headers */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center text-on-surface-variant text-body-sm mb-sm">
            <Link to="/maintenance" className="hover:text-primary">Maintenance</Link>
            <span className="material-symbols-outlined text-[14px] mx-xs">chevron_right</span>
            <span>Record #{record.maintenance_id}</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-background flex items-center gap-md">
            Vehicle: {record.vehicles?.registration_number || 'N/A'}
            <StatusBadge status={prettyStatus(statusName)} />
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            Service Category: {prettyStatus(record.maintenance_types?.type_name)}
          </p>
        </div>
        <div className="flex gap-md">
          {statusName === 'IN_PROGRESS' && (
            <button
              onClick={handleCloseJob}
              className="px-lg py-md bg-primary text-on-primary rounded-lg text-body-md font-bold shadow-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined">check_circle</span>
              <span>Close / Complete Job</span>
            </button>
          )}
          <Link
            to="/maintenance"
            className="px-lg py-md border border-outline-variant rounded-lg text-body-md font-medium bg-surface hover:bg-surface-container-low transition-colors flex items-center"
          >
            Back to logs
          </Link>
        </div>
      </div>

      {/* Progress timeline bar */}
      <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10">
        <div className="flex items-center justify-between px-xl md:px-3xl">
          {stepNodes.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center relative z-10 text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-sm ${
                  step.active
                    ? 'bg-primary text-on-primary ring-4 ring-primary/10 ring-offset-2'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined">
                    {idx === 0 ? 'report' : idx === 1 ? 'build' : 'flag'}
                  </span>
                </div>
                <span className={`font-label-caps uppercase text-[10px] md:text-xs ${step.active ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                  {step.label}
                </span>
              </div>
              {idx < stepNodes.length - 1 && (
                <div className={`flex-grow h-1 mx-4 -mt-6 ${idx < 1 && statusName !== 'PENDING' ? 'bg-primary' : statusName === 'COMPLETED' ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Grid Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        
        {/* Left: Vehicle details */}
        <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-lg border-b border-surface-container pb-sm">
              <h3 className="font-headline-sm text-headline-sm">Vehicle Information</h3>
              <span className="material-symbols-outlined text-outline">directions_bus</span>
            </div>
            <div className="space-y-lg">
              <div className="w-full h-36 rounded-lg overflow-hidden bg-surface-container flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-4xl">directions_bus</span>
              </div>
              <div className="space-y-md">
                <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                  <span className="text-outline">Vehicle Name</span>
                  <span className="font-bold text-on-surface">{record.vehicles?.vehicle_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                  <span className="text-outline">Registration</span>
                  <span className="font-bold text-on-surface">{record.vehicles?.registration_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-xs text-body-sm">
                  <span className="text-outline">Acquisition Cost</span>
                  <span className="font-bold text-on-surface">${Number(record.vehicles?.purchase_cost || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Center: Issue Description & Reporter info */}
        <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10 space-y-lg">
          <div className="flex items-center justify-between border-b border-surface-container pb-sm">
            <h3 className="font-headline-sm text-headline-sm">Fault & Work Description</h3>
            <span className="material-symbols-outlined text-outline">assignment</span>
          </div>
          <div className="p-md bg-surface-container-low/30 border border-outline-variant/35 rounded-xl text-body-sm leading-relaxed">
            {record.problem_description}
          </div>
          <div className="pt-sm space-y-sm">
            <p className="font-label-caps text-on-surface-variant uppercase text-xs">Reported By</p>
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <span className="font-bold text-body-md">{record.users?.full_name || 'System Operator'}</span>
            </div>
          </div>
        </section>

        {/* Right: Costs and timelines */}
        <div className="space-y-lg flex flex-col">
          
          {/* Financials */}
          <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10">
            <div className="flex items-center justify-between mb-lg border-b border-surface-container pb-sm">
              <h3 className="font-headline-sm text-headline-sm">Financial Summary</h3>
              <span className="material-symbols-outlined text-outline">payments</span>
            </div>
            <div className="space-y-md">
              {financialDetails.map((item) => (
                <div key={item.label} className="flex justify-between text-body-sm border-b border-surface-container pb-xs">
                  <span className="text-outline">{item.label}</span>
                  <span className="font-bold text-on-surface">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Timelines */}
          <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10 flex-grow">
            <div className="flex items-center justify-between mb-lg border-b border-surface-container pb-sm">
              <h3 className="font-headline-sm text-headline-sm">Timeline Records</h3>
              <span className="material-symbols-outlined text-outline">schedule</span>
            </div>
            <div className="space-y-md">
              {serviceTimeline.map((item) => (
                <div key={item.label} className="flex justify-between text-body-sm border-b border-surface-container pb-xs">
                  <span className="text-outline">{item.label}</span>
                  <span className="font-bold text-on-surface">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
};

export default MaintenanceDetails;
