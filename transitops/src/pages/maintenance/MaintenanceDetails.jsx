import React from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../../components/ui/StatusBadge';

const steps = [
  { icon: 'check', label: 'Pending', time: 'Oct 12, 08:30 AM', active: false },
  { icon: 'build', label: 'Active', time: 'Oct 13, 09:15 AM', active: true },
  { icon: 'flag', label: 'Completed', time: '-- : --', active: false },
];

const parts = [
  { icon: 'extension', name: 'Transmission Seal Kit', qty: 'x1' },
  { icon: 'opacity', name: 'ZF EcoFluid A Life', qty: '12.5L' },
  { icon: 'filter_alt', name: 'Heavy Duty Oil Filter', qty: 'x2' },
];

const activityLog = [
  { icon: 'build', bg: 'bg-primary-container', label: 'Status changed to Active', detail: 'By John Doe • Oct 13, 09:15 AM' },
  { icon: 'inventory', bg: 'bg-secondary-container', label: 'Parts requested: Seal Kit, Fluid', detail: 'By Logistics Team • Oct 12, 11:30 AM' },
  { icon: 'schedule', bg: 'bg-tertiary-container', label: 'Maintenance Record Created', detail: 'System Auto • Oct 12, 08:30 AM' },
];

export const MaintenanceDetails = () => {
  const { id } = useParams();

  return (
    <div className="space-y-xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center text-on-surface-variant text-body-sm mb-sm">
            <Link to="/maintenance" className="hover:text-primary">Maintenance</Link>
            <span className="material-symbols-outlined text-[14px] mx-xs">chevron_right</span>
            <span>{id || 'M-90248'}</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-background flex items-center gap-md">
            Vehicle ID: #TX-7842
            <StatusBadge status="in-progress" />
          </h2>
          <p className="text-body-lg text-on-surface-variant">Major Component: Transmission Overhaul & Fluid Exchange</p>
        </div>
        <div className="flex gap-md">
          <button className="px-lg py-md border border-outline-variant rounded-lg text-body-md font-medium hover:bg-surface-container-low transition-colors">Generate Report</button>
          <button className="px-lg py-md bg-primary-container text-on-primary rounded-lg text-body-md font-bold shadow-sm hover:opacity-90 transition-opacity">Edit Record</button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-3xl">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-sm ${
                  step.active
                    ? 'bg-primary-container text-on-primary ring-4 ring-primary-container/20 ring-offset-2'
                    : idx < 2 ? 'bg-primary-container text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <span className={`font-label-caps uppercase ${step.active ? 'text-on-surface font-bold' : 'text-on-surface'}`}>{step.label}</span>
                <span className="text-body-sm text-on-surface-variant">{step.time}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-grow h-1 mx-4 -mt-10 ${idx < 2 ? 'bg-primary-container' : 'bg-surface-container-high'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="flex flex-col gap-xl">
          <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] h-full">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-headline-sm text-headline-sm">Vehicle Information</h3>
              <span className="material-symbols-outlined text-on-surface-variant">directions_bus</span>
            </div>
            <div className="space-y-lg">
              <div className="w-full h-40 rounded-lg overflow-hidden bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl">directions_bus</span>
              </div>
              <div className="grid grid-cols-2 gap-md">
                {[
                  { label: 'Make / Model', value: 'Proterra Catalyst E2' },
                  { label: 'Model Year', value: '2023' },
                  { label: 'Odometer', value: '42,850 mi' },
                  { label: 'Last Service', value: '12 Aug 2023' },
                ].map((info) => (
                  <div key={info.label} className="p-md bg-surface-container rounded-lg">
                    <p className="text-body-sm text-on-surface-variant mb-xs">{info.label}</p>
                    <p className="font-body-md font-bold text-on-surface">{info.value}</p>
                  </div>
                ))}
              </div>
              <div className="pt-md border-t border-outline-variant">
                <p className="text-body-sm text-on-surface-variant mb-xs">Assigned Depot</p>
                <p className="font-body-md font-bold flex items-center">
                  <span className="material-symbols-outlined text-[18px] mr-xs text-secondary">location_on</span>
                  Central Transit Hub - Bay 04
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-xl">
          <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] h-full">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-headline-sm text-headline-sm">Maintenance Details</h3>
              <span className="material-symbols-outlined text-on-surface-variant">settings_suggest</span>
            </div>
            <div className="space-y-lg">
              <div className="flex items-center p-md bg-primary-container/5 rounded-lg border border-primary-container/10">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mr-md border-2 border-primary-container">
                  <span className="material-symbols-outlined text-primary-container">person</span>
                </div>
                <div>
                  <p className="text-body-sm text-on-surface-variant">Lead Mechanic</p>
                  <p className="font-body-md font-bold text-on-background">John Doe</p>
                  <p className="text-body-sm text-primary-container font-medium">Certified EV Technician</p>
                </div>
              </div>
              <div>
                <p className="font-label-caps text-on-surface-variant mb-sm uppercase">Parts Replaced</p>
                <ul className="space-y-sm">
                  {parts.map((part) => (
                    <li key={part.name} className="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/30">
                      <div className="flex items-center">
                        <span className="material-symbols-outlined text-[18px] mr-sm text-on-surface-variant">{part.icon}</span>
                        <span className="text-body-md">{part.name}</span>
                      </div>
                      <span className="text-body-sm font-medium">{part.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="text-center p-md border border-outline-variant rounded-lg">
                  <p className="text-label-caps text-on-surface-variant mb-xs">Labor Hours</p>
                  <p className="font-headline-sm text-headline-sm text-primary">14.5 hrs</p>
                </div>
                <div className="text-center p-md border border-outline-variant rounded-lg">
                  <p className="text-label-caps text-on-surface-variant mb-xs">Estimated Completion</p>
                  <p className="font-body-md font-bold">Oct 16, 2023</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-xl">
          <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-headline-sm text-headline-sm">Financial Summary</h3>
              <span className="material-symbols-outlined text-on-surface-variant">payments</span>
            </div>
            <div className="space-y-sm">
              {[
                { label: 'Parts & Components', amount: '$1,245.80' },
                { label: 'Labor ($95/hr)', amount: '$1,377.50' },
                { label: 'Disposal Fees', amount: '$45.00' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">{item.label}</span>
                  <span className="font-medium">{item.amount}</span>
                </div>
              ))}
              <div className="pt-sm border-t-2 border-dotted border-outline-variant mt-md flex justify-between items-end">
                <span className="font-bold text-on-surface">Total Cost</span>
                <div className="text-right">
                  <p className="font-kpi-lg text-kpi-lg text-primary">$2,668.30</p>
                  <p className="text-body-sm text-on-surface-variant">Excl. Tax</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex-grow">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-headline-sm text-headline-sm">Activity Log</h3>
              <button className="text-body-sm text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="relative">
              <div className="absolute left-[11px] top-0 bottom-0 w-px bg-outline-variant"></div>
              <div className="space-y-lg relative">
                {activityLog.map((item, idx) => (
                  <div key={idx} className="flex gap-md">
                    <div className={`w-[24px] h-[24px] rounded-full ${item.bg} ring-4 ring-surface flex items-center justify-center z-10`}>
                      <span className="material-symbols-outlined text-[14px] text-on-primary">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-body-md font-bold">{item.label}</p>
                      <p className="text-body-sm text-on-surface-variant">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetails;
