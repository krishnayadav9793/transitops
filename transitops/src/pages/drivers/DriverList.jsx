import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import StatusBadge from '../../components/ui/StatusBadge';
import { SearchInput } from '../../components/ui/FilterBar';
import DriverFormModal from './DriverFormModal';

const prettyStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get('/drivers');
      setDrivers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve driver registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDelete = async (driverId, driverName) => {
    if (!window.confirm(`Are you sure you want to remove driver "${driverName}"?`)) return;
    try {
      await apiClient.delete(`/drivers/${driverId}`);
      fetchDrivers();
    } catch (err) {
      alert(err.message || 'Failed to delete driver.');
    }
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDriver(null);
    setModalOpen(true);
  };

  // Filter & Search computation
  const filteredDrivers = drivers.filter((d) => {
    const statusName = d.driver_statuses?.status_name || 'AVAILABLE';
    const matchesStatus = statusFilter === 'ALL' || statusName === statusFilter;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      d.full_name.toLowerCase().includes(query) ||
      d.license_number.toLowerCase().includes(query) ||
      d.phone.includes(query) ||
      (d.email && d.email.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const activeCount = drivers.filter(d => d.driver_statuses?.status_name === 'ON_TRIP').length;
  const suspendedCount = drivers.filter(d => d.driver_statuses?.status_name === 'SUSPENDED').length;
  const avgSafetyScore = drivers.length > 0
    ? (drivers.reduce((acc, d) => acc + Number(d.safety_score), 0) / drivers.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Driver Management</h2>
          <p className="text-on-surface-variant mt-xs">Manage your fleet drivers and their assignments.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary-container text-white font-headline-sm px-xl py-md rounded-lg flex items-center gap-sm transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined">person_add</span>
          <span>Add Driver</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/10">
          <p className="font-label-caps text-label-caps text-outline uppercase mb-1">Total Fleet Strength</p>
          <h3 className="font-kpi-lg text-kpi-lg text-on-surface">{drivers.length}</h3>
          <div className="mt-4 flex items-center text-primary font-bold text-body-sm">
            <span className="material-symbols-outlined mr-1">trending_up</span>
            Active records in system
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/10">
          <p className="font-label-caps text-label-caps text-outline uppercase mb-1">Active on Trip</p>
          <h3 className="font-kpi-lg text-kpi-lg text-on-surface">{activeCount}</h3>
          <div className="mt-4 flex items-center text-outline font-medium text-body-sm">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            {drivers.length > 0 ? ((activeCount / drivers.length) * 100).toFixed(0) : 0}% Utilization
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/10">
          <p className="font-label-caps text-label-caps text-outline uppercase mb-1">Safety Avg.</p>
          <h3 className="font-kpi-lg text-kpi-lg text-on-surface">{avgSafetyScore}</h3>
          <div className="mt-4 flex items-center text-primary font-bold text-body-sm">
            <span className="material-symbols-outlined mr-1">check_circle</span>
            Fleet average score
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/10">
          <p className="font-label-caps text-label-caps text-error uppercase mb-1">Suspended Drivers</p>
          <h3 className="font-kpi-lg text-kpi-lg text-error">{suspendedCount}</h3>
          <div className="mt-4 flex items-center text-error font-medium text-body-sm">
            <span className="material-symbols-outlined mr-1 text-[18px]">warning</span>
            Compliance issues
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-lg mb-lg flex flex-wrap items-center gap-lg border border-surface-container">
        <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-outline-variant/20">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-lg py-sm rounded-lg font-label-caps text-label-caps uppercase transition-colors cursor-pointer ${
              statusFilter === 'ALL' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            All Drivers
          </button>
          <button
            onClick={() => setStatusFilter('AVAILABLE')}
            className={`px-lg py-sm rounded-lg font-label-caps text-label-caps uppercase transition-colors cursor-pointer ${
              statusFilter === 'AVAILABLE' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setStatusFilter('ON_TRIP')}
            className={`px-lg py-sm rounded-lg font-label-caps text-label-caps uppercase transition-colors cursor-pointer ${
              statusFilter === 'ON_TRIP' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            On Trip
          </button>
          <button
            onClick={() => setStatusFilter('SUSPENDED')}
            className={`px-lg py-sm rounded-lg font-label-caps text-label-caps uppercase transition-colors cursor-pointer ${
              statusFilter === 'SUSPENDED' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Suspended
          </button>
        </div>

        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, license, phone..."
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
        {error && (
          <div className="p-lg bg-error/10 text-error border-b border-error/20">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">Driver Name</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">Status</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">Assigned Vehicle</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">License Category / Expiry</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase">Safety Score</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-outline uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-lg py-8 text-center text-outline italic">
                    Loading driver registries...
                  </td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-lg py-8 text-center text-outline italic">
                    No drivers match search parameters or filters.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => {
                  const activeAssignment = driver.trip_assignments?.find((ta) => ta.is_active);
                  const vehicle = activeAssignment?.vehicles;
                  
                  return (
                    <tr key={driver.driver_id} className="hover:bg-surface-container-low/30 transition-colors group">
                      <td className="px-lg py-md">
                        <Link to={`/drivers/${driver.driver_id}`} className="flex items-center gap-3 hover:text-primary">
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline">person</span>
                          </div>
                          <div>
                            <p className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors">{driver.full_name}</p>
                            <p className="font-body-sm text-outline">ID: DRV-{driver.driver_id}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-lg py-md">
                        <StatusBadge status={prettyStatus(driver.driver_statuses?.status_name)} />
                      </td>
                      <td className="px-lg py-md">
                        {vehicle ? (
                          <div>
                            <p className="font-body-md font-medium">{vehicle.vehicle_name || 'Assigned Vehicle'}</p>
                            <p className="font-body-sm text-outline">Plate: {vehicle.registration_number}</p>
                          </div>
                        ) : (
                          <p className="font-body-md text-outline italic">Not Assigned</p>
                        )}
                      </td>
                      <td className="px-lg py-md">
                        <div>
                          <p className="font-body-md font-medium">{driver.license_categories?.category_name || 'N/A'}</p>
                          <p className="font-body-sm text-outline">Expires: {new Date(driver.license_expiry_date).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-2">
                          <span className={`font-kpi-md ${driver.safety_score >= 90 ? 'text-primary' : driver.safety_score >= 70 ? 'text-secondary' : 'text-error'}`}>
                            {Number(driver.safety_score).toFixed(0)}
                          </span>
                          <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className={`h-full ${driver.safety_score >= 90 ? 'bg-primary' : driver.safety_score >= 70 ? 'bg-secondary' : 'bg-error'}`} style={{ width: `${driver.safety_score}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(driver)}
                          className="px-sm py-xs font-semibold text-primary hover:bg-primary/5 rounded mr-md transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(driver.driver_id, driver.full_name)}
                          className="px-sm py-xs font-semibold text-error hover:bg-error/5 rounded transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="px-lg py-md bg-surface-container-low/30 border-t border-outline-variant/20 flex items-center justify-between">
          <p className="font-body-sm text-outline">Showing <span className="font-bold text-on-surface">{filteredDrivers.length}</span> of <span className="font-bold text-on-surface">{drivers.length}</span> drivers</p>
        </div>
      </div>

      <DriverFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        driver={selectedDriver}
        onSaved={fetchDrivers}
      />
    </div>
  );
};

export default DriverList;