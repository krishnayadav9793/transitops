import React, { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import { SearchInput, FilterSelect } from '../../components/ui/FilterBar';

export const VehicleList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const vehicles = [
    { id: 'NY-9921-TRK', model: 'Freightliner Cascadia', type: 'Class 8 Heavy Truck', capacity: '18 Tons', odometer: 142504, status: 'Active', region: 'US' },
    { id: 'BE-7712-VAN', model: 'Mercedes Sprinter', type: 'Light Cargo Van', capacity: '3.5 Tons', odometer: 68210, status: 'Maintenance', region: 'EU' },
    { id: 'LD-1288-TRK', model: 'Scania R450', type: 'Heavy Duty Hauler', capacity: '24 Tons', odometer: 289112, status: 'Out of Service', region: 'UK' },
    { id: 'PA-0044-TRK', model: 'Volvo FH16', type: 'Heavy Duty Truck', capacity: '20 Tons', odometer: 12400, status: 'Active', region: 'US' },
    { id: 'TO-9882-VAN', model: 'Ford Transit High Roof', type: 'Cargo Van', capacity: '5 Tons', odometer: 45902, status: 'Idle', region: 'CA' },
  ];

  const columns = [
    { header: 'Registration', key: 'id', render: (val, row) => (
      <div className="flex items-center gap-md">
        <div className="w-6 h-4 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0">
          <img alt={row.region} className="w-full h-full object-cover" />
        </div>
        <span className="font-body-md font-semibold text-on-surface">{val}</span>
      </div>
    )},
    { header: 'Model', key: 'model', render: (val, row) => (
      <div>
        <p className="font-body-md text-on-surface">{val}</p>
        <p className="font-body-sm text-on-surface-variant">{row.type}</p>
      </div>
    )},
    { header: 'Capacity', key: 'capacity' },
    { header: 'Odometer', key: 'odometer', align: 'text-right', render: (val) => (
      <span className="font-kpi-md text-[16px]">{val.toLocaleString()} <span className="text-body-sm text-on-surface-variant">km</span></span>
    )},
    { header: 'Status', key: 'status', align: 'text-center', render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Vehicle Management</h2>
          <nav className="flex text-on-surface-variant font-body-sm gap-xs mt-xs">
            <span>Fleet</span>
            <span>/</span>
            <span className="text-primary font-semibold">Vehicles</span>
          </nav>
        </div>
        <button className="bg-primary-container hover:bg-primary-container/90 text-on-primary-container px-lg py-md rounded-lg font-body-md font-semibold flex items-center gap-sm transition-all shadow-md active:scale-95">
          <span className="material-symbols-outlined">add</span>
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-lg mb-xl flex flex-wrap items-center gap-lg border border-surface-container">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Filters</span>
        </div>
        <div className="h-8 w-px bg-outline-variant"></div>

        {/* Status Chips */}
        <div className="flex p-1 bg-surface-container rounded-lg">
          {['All', 'Active', 'Maintenance', 'Idle'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status.toLowerCase())}
              className={`px-lg py-sm rounded-md font-body-md font-medium transition-colors ${
                statusFilter === status.toLowerCase()
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-outline-variant hidden lg:block"></div>

        <div className="flex flex-wrap gap-md">
          <FilterSelect
            label="Region"
            options={[
              { value: 'all', label: 'All Regions' },
              { value: 'us', label: 'North America' },
              { value: 'eu', label: 'Western Europe' },
              { value: 'uk', label: 'UK' },
              { value: 'ca', label: 'Canada' },
            ]}
            value="all"
            onChange={() => {}}
          />
          <FilterSelect
            label="Capacity"
            options={[
              { value: 'all', label: 'Capacity' },
              { value: 'under5', label: 'Under 5 Tons' },
              { value: '5-15', label: '5-15 Tons' },
              { value: 'over15', label: 'Over 15 Tons' },
            ]}
            value="all"
            onChange={() => {}}
          />
          <FilterSelect
            label="Vehicle Type"
            options={[
              { value: 'all', label: 'Vehicle Type' },
              { value: 'truck', label: 'Heavy Duty Truck' },
              { value: 'van', label: 'Light Cargo Van' },
              { value: 'trailer', label: 'Trailer' },
            ]}
            value="all"
            onChange={() => {}}
          />
        </div>

        <SearchInput
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="ml-auto w-full md:w-64"
        />
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Registration</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Model</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Capacity</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Odometer</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-md">
                      <div className="w-6 h-4 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0"></div>
                      <span className="font-body-md font-semibold text-on-surface">{vehicle.id}</span>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <p className="font-body-md text-on-surface">{vehicle.model}</p>
                    <p className="font-body-sm text-on-surface-variant">{vehicle.type}</p>
                  </td>
                  <td className="px-lg py-md text-on-surface font-body-md">{vehicle.capacity}</td>
                  <td className="px-lg py-md text-right font-kpi-md text-[16px] text-on-surface">
                    {vehicle.odometer.toLocaleString()} <span className="text-body-sm text-on-surface-variant">km</span>
                  </td>
                  <td className="px-lg py-md text-center">
                    <StatusBadge status={vehicle.status} />
                  </td>
                  <td className="px-lg py-md text-right">
                    <div className="flex justify-end gap-sm">
                      <button className="p-sm text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="p-sm text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="p-sm text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[20px]">archive</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-lg py-md flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
          <p className="font-body-sm text-on-surface-variant">Showing <span className="font-semibold">1-5</span> of <span className="font-semibold">48</span> vehicles</p>
          <div className="flex gap-xs">
            <button className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="px-md py-sm bg-primary-container text-on-primary-container rounded-lg font-body-md font-semibold">1</button>
            <button className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors font-body-md">2</button>
            <button className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors font-body-md">3</button>
            <span className="px-sm py-sm text-on-surface-variant">...</span>
            <button className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors font-body-md">10</button>
            <button className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;