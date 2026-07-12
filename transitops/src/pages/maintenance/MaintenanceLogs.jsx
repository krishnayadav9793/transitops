import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import StatusBadge from '../../components/ui/StatusBadge';

const prettyStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export const MaintenanceLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get('/maintenance');
      setLogs(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve maintenance registries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCloseLog = async (id) => {
    const cost = window.prompt('Enter actual service cost (USD):', '250.00');
    if (cost === null) return;
    if (isNaN(Number(cost)) || Number(cost) < 0) {
      return alert('Please enter a valid amount.');
    }

    try {
      await apiClient.put(`/maintenance/${id}/close`, {
        actual_cost: Number(cost),
        actual_completion_date: new Date().toISOString().split('T')[0]
      });
      fetchLogs();
    } catch (err) {
      alert(err.message || 'Failed to close maintenance log.');
    }
  };

  // Filter tasks based on activeTab
  const filteredTasks = logs.filter((task) => {
    const status = task.maintenance_statuses?.status_name || 'PENDING';
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return status === 'PENDING';
    if (activeTab === 'active') return status === 'IN_PROGRESS';
    if (activeTab === 'completed') return status === 'COMPLETED';
    return true;
  });

  const activeJobs = logs.filter(l => l.maintenance_statuses?.status_name === 'IN_PROGRESS').length;
  const pendingJobs = logs.filter(l => l.maintenance_statuses?.status_name === 'PENDING').length;
  const totalCost = logs.reduce((sum, l) => sum + Number(l.actual_cost || l.estimated_cost || 0), 0);

  return (
    <div className="space-y-lg">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Maintenance Operations</h2>
          <div className="flex items-center gap-md mt-xs">
            <div className="flex items-center gap-xs text-primary font-medium text-body-sm">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              {activeJobs} Active Jobs
            </div>
            <div className="text-outline-variant text-body-sm">•</div>
            <div className="text-on-surface-variant text-body-sm">{pendingJobs} Pending Requests</div>
          </div>
        </div>
        <div className="flex items-center gap-md w-full lg:w-auto">
          <Link
            to="/maintenance/schedule"
            className="flex-grow lg:flex-none px-lg py-md bg-primary text-on-primary rounded-lg font-bold text-body-md flex items-center justify-center gap-sm shadow-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span>Schedule Maintenance</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-sm">Total Scheduled Tasks</p>
          <div className="flex justify-between items-end">
            <p className="font-kpi-lg text-kpi-lg text-on-surface">{logs.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-sm">Active Jobs In Shop</p>
          <div className="flex justify-between items-end">
            <p className="font-kpi-lg text-kpi-lg text-on-surface">{activeJobs}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-sm">Pending Request Queue</p>
          <div className="flex justify-between items-end">
            <p className="font-kpi-lg text-kpi-lg text-on-surface">{pendingJobs}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-sm">Total Expenditures</p>
          <div className="flex justify-between items-end">
            <p className="font-kpi-lg text-kpi-lg text-on-surface">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="flex flex-col xl:flex-row gap-xl items-start">
        
        {/* Table Section */}
        <div className="flex-1 w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          {error && (
            <div className="p-lg bg-error/10 text-error border-b border-error/20 font-body-sm">
              {error}
            </div>
          )}

          <div className="p-lg border-b border-outline-variant/30 flex flex-wrap gap-md items-center justify-between">
            <div className="flex gap-md overflow-x-auto pb-xs lg:pb-0">
              {[
                { label: 'All Tasks', tab: 'all' },
                { label: 'Pending', tab: 'pending' },
                { label: 'Active', tab: 'active' },
                { label: 'Completed', tab: 'completed' },
              ].map(({ label, tab }) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-md py-sm rounded-full text-body-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'bg-primary text-on-primary'
                      : 'hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Record / Vehicle</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Service Type</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Description</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Scheduled Date</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Cost Estimate</th>
                  <th className="px-lg py-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-lg py-8 text-center text-outline italic">
                      Loading maintenance records...
                    </td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-lg py-8 text-center text-outline italic">
                      No maintenance entries found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const status = task.maintenance_statuses?.status_name || 'PENDING';
                    return (
                      <tr key={task.maintenance_id} className="hover:bg-surface-bright transition-colors group">
                        
                        {/* Record ID / Vehicle */}
                        <td className="px-lg py-md">
                          <Link to={`/maintenance/${task.maintenance_id}`} className="hover:text-primary">
                            <p className="font-body-md font-bold text-on-surface group-hover:text-primary">#MNT-{task.maintenance_id}</p>
                            <p className="text-body-sm text-on-surface-variant">{task.vehicles?.registration_number || 'N/A'}</p>
                          </Link>
                        </td>

                        {/* Service Type */}
                        <td className="px-lg py-md text-body-md text-on-surface font-semibold">
                          {prettyStatus(task.maintenance_types?.type_name)}
                        </td>

                        {/* Problem Description */}
                        <td className="px-lg py-md text-body-sm text-on-surface-variant max-w-xs truncate" title={task.problem_description}>
                          {task.problem_description}
                        </td>

                        {/* Date */}
                        <td className="px-lg py-md text-body-sm text-on-surface">
                          {task.start_date ? new Date(task.start_date).toLocaleDateString() : 'N/A'}
                        </td>

                        {/* Status */}
                        <td className="px-lg py-md">
                          <StatusBadge status={prettyStatus(status)} />
                        </td>

                        {/* Cost */}
                        <td className="px-lg py-md font-body-md font-bold text-on-surface">
                          ${Number(task.actual_cost || task.estimated_cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Actions */}
                        <td className="px-lg py-md text-right whitespace-nowrap">
                          {status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => handleCloseLog(task.maintenance_id)}
                              className="px-sm py-xs font-semibold text-primary hover:bg-primary/5 rounded mr-md transition-all cursor-pointer"
                            >
                              Close Job
                            </button>
                          )}
                          <Link
                            to={`/maintenance/${task.maintenance_id}`}
                            className="px-sm py-xs font-semibold text-outline hover:bg-surface-container rounded transition-all inline-block"
                          >
                            Details
                          </Link>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="p-lg bg-surface-container-low flex justify-between items-center">
            <span className="text-body-sm text-on-surface-variant">
              Showing {filteredTasks.length} of {logs.length} entries
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MaintenanceLogs;