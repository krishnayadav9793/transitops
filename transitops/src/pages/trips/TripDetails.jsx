import React from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../../components/ui/StatusBadge';

const timeline = [
  { title: 'In Transit', time: '12:30 PM (Now)', desc: 'Vehicle is currently traveling along the PIE Highway. Speed maintained at 62km/h. No traffic anomalies detected.', badge: 'Route Compliance Verified', current: true },
  { title: 'Cargo Loaded', time: '10:15 AM', desc: 'Loading completed at Port Terminal 4. Weight Bridge confirmed 14.2 tons. BOL #4492-Z signed digitally by supervisor.' },
  { title: 'En Route to Source', time: '09:05 AM', desc: 'Driver departed from Central Depot. Navigation path to Port Terminal 4 locked.' },
  { title: 'Dispatched', time: '08:45 AM', desc: 'Trip assigned to Marcus Thorne. Vehicle VOLVO-FH16-09 allocated. All safety checklists cleared by Fleet Ops.' },
  { title: 'Trip Created (Draft)', time: '07:30 AM', desc: 'Automated generation from Customer Order #REQ-9912. Verified against stock availability.' },
];

export const TripDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-xl py-lg flex justify-between items-end">
        <div>
          <div className="flex items-center gap-md mb-base">
            <Link to="/trips" className="text-primary flex items-center gap-xs hover:underline">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="font-label-caps text-label-caps">Back to Trips</span>
            </Link>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-md">
            {id || 'TRK-8842-X'}
            <span className="bg-primary-container text-on-primary-container px-md py-xs rounded-full font-label-caps text-[10px] uppercase tracking-widest flex items-center gap-xs">
              <span className="w-2 h-2 bg-primary-fixed rounded-full animate-pulse"></span>
              On Going
            </span>
          </h2>
          <p className="font-body-md text-on-surface-variant mt-xs">Route: Port of Singapore → West Industrial Hub</p>
        </div>
        <div className="flex gap-md">
          <button className="px-lg py-sm border border-outline-variant rounded-lg font-body-md hover:bg-surface-container transition-colors">Cancel Trip</button>
          <button className="px-lg py-sm bg-primary text-white rounded-lg font-body-md hover:bg-primary/90 shadow-sm transition-colors">Modify Dispatch</button>
        </div>
      </div>

      <div className="px-xl pb-xl flex gap-xl flex-1 max-w-[1440px]">
        <div className="w-3/5 flex flex-col gap-lg">
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] overflow-hidden border border-surface-container">
            <div className="h-64 w-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl">map</span>
                <p className="font-body-sm mt-sm">Route Map</p>
              </div>
            </div>
            <div className="p-md bg-white/90 backdrop-blur-md flex items-center gap-lg border-t border-surface-container">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-xs">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Live Progress</span>
                  <span className="font-body-sm text-primary font-bold">64% Completed</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[64%] rounded-full shadow-[0_0_8px_rgba(15,82,56,0.4)]"></div>
                </div>
              </div>
              <div className="text-right border-l border-outline-variant pl-lg">
                <p className="font-label-caps text-label-caps text-on-surface-variant">ETA</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">14:45 <span className="text-body-sm font-normal">SGT</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-lg">
            <div className="bg-white p-lg rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-surface-container">
              <h3 className="font-headline-sm text-headline-sm mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Asset Details
              </h3>
              <div className="flex items-center gap-md mb-lg p-sm bg-surface-container-low rounded-lg border border-surface-container">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <p className="font-body-md font-bold text-on-surface">Marcus Thorne</p>
                  <p className="font-body-sm text-on-surface-variant">License: B-293-88</p>
                </div>
                <button className="ml-auto w-8 h-8 flex items-center justify-center text-primary hover:bg-primary-container/10 rounded-full">
                  <span className="material-symbols-outlined">call</span>
                </button>
              </div>
              <div className="space-y-sm">
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Vehicle ID</span>
                  <span className="text-body-sm font-bold">VOLVO-FH16-09</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Fuel Level</span>
                  <span className="text-body-sm font-bold text-secondary">42% (Refuel Suggestion)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Tire Pressure</span>
                  <span className="text-body-sm font-bold text-primary">Optimal</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-lg rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-surface-container">
              <h3 className="font-headline-sm text-headline-sm mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                Cargo Info
              </h3>
              <div className="p-sm bg-surface-container-low rounded-lg mb-lg border border-surface-container">
                <div className="flex justify-between mb-xs">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Consignment</span>
                  <span className="font-label-caps text-label-caps text-on-surface">HAZMAT-3</span>
                </div>
                <p className="font-body-md font-bold text-on-surface">Lithium-Ion Modules</p>
              </div>
              <div className="space-y-sm">
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Total Weight</span>
                  <span className="text-body-sm font-bold">14,200 KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Dimensions</span>
                  <span className="text-body-sm font-bold">2.4m x 12.1m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Handling</span>
                  <span className="text-body-sm font-bold text-error">Temp Sensitive</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-lg">
            <div className="bg-white p-md rounded-xl shadow-sm border border-surface-container">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Avg Speed</p>
              <p className="font-kpi-md text-kpi-md text-on-surface">62 <span className="text-body-sm font-normal">km/h</span></p>
            </div>
            <div className="bg-white p-md rounded-xl shadow-sm border border-surface-container">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Drive Time</p>
              <p className="font-kpi-md text-kpi-md text-on-surface">04:12 <span className="text-body-sm font-normal">hrs</span></p>
            </div>
            <div className="bg-white p-md rounded-xl shadow-sm border border-surface-container">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Efficiency</p>
              <p className="font-kpi-md text-kpi-md text-primary">+8.4%</p>
            </div>
          </div>
        </div>

        <div className="w-2/5 flex flex-col bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-surface-container overflow-hidden">
          <div className="p-lg border-b border-surface-container flex justify-between items-center bg-surface-container-lowest">
            <h3 className="font-headline-sm text-headline-sm">Activity Timeline</h3>
            <span className="material-symbols-outlined text-outline">more_vert</span>
          </div>
          <div className="flex-1 overflow-y-auto p-lg custom-scrollbar">
            <div className="relative space-y-xl">
              {timeline.map((item, idx) => (
                <div key={idx} className={`flex gap-lg relative ${idx < timeline.length - 1 ? 'timeline-line' : ''}`}>
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.current ? 'bg-primary shadow-[0_0_12px_rgba(15,82,56,0.3)]' : 'bg-primary'
                  }`}>
                    <span className={`material-symbols-outlined text-white text-[14px] ${item.current ? '' : ''}`} style={item.current ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {item.current ? 'location_on' : idx === timeline.length - 1 ? 'description' : 'check'}
                    </span>
                  </div>
                  <div className="flex-1 pb-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-body-md font-bold text-on-surface">{item.title}</h4>
                      <span className="text-body-sm text-on-surface-variant whitespace-nowrap ml-sm">{item.time}</span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-xs leading-relaxed">{item.desc}</p>
                    {item.badge && (
                      <div className="mt-md p-sm bg-primary-container/10 border border-primary/20 rounded-lg flex items-center gap-sm">
                        <span className="material-symbols-outlined text-primary text-[18px]">gpp_good</span>
                        <span className="text-body-sm font-bold text-primary">{item.badge}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-lg bg-surface-container-lowest border-t border-surface-container">
            <div className="flex items-center gap-md">
              <div className="flex-1 relative">
                <input className="w-full border-outline-variant rounded-lg py-sm px-md text-body-sm focus:ring-primary focus:border-primary" placeholder="Add a log entry or note..." type="text" />
              </div>
              <button className="p-sm bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button className="px-md py-sm bg-primary text-white rounded-lg text-body-sm font-bold hover:bg-primary/90 transition-all">Update</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bfc9c1; border-radius: 10px; }
        .timeline-line::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 24px;
          bottom: 0;
          width: 2px;
          background: #e1e3df;
        }
      `}</style>
    </div>
  );
};

export default TripDetails;
