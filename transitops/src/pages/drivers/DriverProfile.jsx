import React from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../../components/ui/StatusBadge';

const kpiData = [
  { label: 'Safety Score', value: '98.4', trend: '+2.1%', color: 'text-primary', border: 'border-l-4 border-primary' },
  { label: 'Total Trips', value: '1,248', sub: 'Lifetime', color: 'text-secondary', border: 'border-l-4 border-secondary' },
  { label: 'Performance Rating', value: '4.9', stars: 5, color: 'text-primary-container', border: 'border-l-4 border-primary-container' },
  { label: 'Safety Violations', value: '0', sub: 'Last 6 Months', color: 'text-error', border: 'border-l-4 border-error' },
];

const licenseData = [
  { icon: 'badge', bg: 'bg-primary-fixed', title: "Commercial Driver's License (CDL)", sub: 'Class A • #IL92834710', expires: 'Dec 2026', color: 'text-primary' },
  { icon: 'medical_services', bg: 'bg-secondary-fixed', title: "Medical Examiner's Certificate", sub: 'DOT Compliance • Current', expires: 'Jan 2024', color: 'text-error' },
  { icon: 'award_star', bg: 'bg-surface-container-high', title: 'Hazmat Endorsement', sub: 'Specialty Transport', expires: 'May 2025', color: 'text-on-surface' },
  { icon: 'eco', bg: 'bg-surface-container-high', title: 'Eco-Driving Certification', sub: 'Sustainability Module', expires: null, color: null },
];

const vehicleHistory = [
  { name: 'Freightliner Cascadia 2023', unit: '#ECO-442', plate: 'TRK-990', period: 'Jan 2023 - Present', current: true },
  { name: 'Volvo VNL 860', unit: '#HV-102', plate: 'RRT-112', period: 'June 2020 - Dec 2022', current: false },
  { name: 'Kenworth T680', unit: '#STD-08', plate: 'MKL-445', period: 'Oct 2019 - May 2020', current: false },
];

const recentTrips = [
  { id: 'TR-9021', route: 'Chicago Hub → Detroit DC', corridor: 'Interstate 94 Corridor', date: 'Oct 24, 2023', efficiency: '7.8 MPG', status: 'Completed', efficient: true },
  { id: 'TR-8994', route: 'Chicago Hub → Milwaukee', corridor: 'Short Haul Logistics', date: 'Oct 22, 2023', efficiency: '7.2 MPG', status: 'Completed', efficient: false },
  { id: 'TR-8950', route: 'St. Louis → Chicago Hub', corridor: 'Regional Return', date: 'Oct 20, 2023', efficiency: '7.4 MPG', status: 'Completed', efficient: false },
  { id: 'TR-8812', route: 'Chicago Hub → Indianapolis', corridor: 'Express Freight', date: 'Oct 18, 2023', efficiency: '6.1 MPG', status: 'Review', efficient: false },
];

const personalInfo = [
  { label: 'Employee ID', value: 'TO-77492' },
  { label: 'Hire Date', value: 'Oct 12, 2019' },
  { label: 'Contract Type', value: 'Full-Time' },
  { label: 'Date of Birth', value: 'Aug 24, 1982' },
  { label: 'Emergency Contact', value: 'Sarah Sterling' },
];

export const DriverProfile = () => {
  const { id } = useParams();

  return (
    <div className="space-y-xl">
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
              <h1 className="font-headline-lg text-headline-lg">Marcus Sterling</h1>
              <StatusBadge status="on-trip" />
            </div>
            <div className="flex flex-wrap gap-xl text-on-surface-variant">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-md">mail</span>
                <span className="font-body-md">m.sterling@transitops.com</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-md">phone</span>
                <span className="font-body-md">+1 (555) 342-9012</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-md">location_on</span>
                <span className="font-body-md">Chicago, IL Hub</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-md">
          <button className="px-xl py-md bg-surface-variant text-on-surface-variant font-bold rounded-xl flex items-center gap-sm hover:bg-outline-variant transition-colors active:scale-95">
            <span className="material-symbols-outlined">edit</span>
            Edit Profile
          </button>
          <button className="px-xl py-md bg-error text-on-error font-bold rounded-xl flex items-center gap-sm hover:opacity-90 transition-opacity active:scale-95">
            <span className="material-symbols-outlined">block</span>
            Suspend Access
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className={`bg-surface-container-lowest p-lg rounded-xl shadow-sm ${kpi.border}`}>
            <p className="text-outline font-label-caps uppercase mb-sm">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <h3 className={`font-kpi-lg text-kpi-lg ${kpi.color}`}>{kpi.value}</h3>
              {kpi.trend && (
                <div className="flex items-center text-primary font-bold text-sm mb-1">
                  <span className="material-symbols-outlined">trending_up</span>
                  <span>{kpi.trend}</span>
                </div>
              )}
              {kpi.stars && (
                <div className="flex gap-xs mb-1">
                  {Array.from({ length: kpi.stars }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              )}
              {kpi.sub && <div className="text-outline font-body-sm mb-1">{kpi.sub}</div>}
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-lg rounded-xl shadow-sm space-y-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm">Personal Info</h3>
            <span className="material-symbols-outlined text-outline cursor-pointer">more_horiz</span>
          </div>
          <div className="space-y-md">
            {personalInfo.map((info) => (
              <div key={info.label} className="flex justify-between border-b border-surface-container pb-sm">
                <span className="text-outline font-body-sm">{info.label}</span>
                <span className="font-bold">{info.value}</span>
              </div>
            ))}
          </div>
          <div className="pt-md">
            <p className="text-outline font-label-caps uppercase mb-xs">Internal Notes</p>
            <p className="text-body-sm bg-surface-container p-md rounded-lg italic">
              "Consistently receives high feedback for efficiency and vehicle maintenance. Recommended for senior trainer role next quarter."
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-lg rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-sm text-headline-sm">License & Certifications</h3>
            <button className="text-primary font-bold text-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Add New
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {licenseData.map((lic) => (
              <div key={lic.title} className="p-md border border-surface-container rounded-xl flex items-center gap-md">
                <div className={`${lic.bg} p-sm rounded-lg text-on-primary-fixed`}>
                  <span className="material-symbols-outlined">{lic.icon}</span>
                </div>
                <div className="flex-grow">
                  <p className="font-bold">{lic.title}</p>
                  <p className="text-outline text-body-sm">{lic.sub}</p>
                </div>
                <div className="text-right">
                  {lic.expires ? (
                    <>
                      <p className="text-outline text-xs uppercase font-bold">Expires</p>
                      <p className={`font-bold ${lic.color || 'text-on-surface'}`}>{lic.expires}</p>
                    </>
                  ) : (
                    <span className="px-md py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold uppercase">No Expiry</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest p-lg rounded-xl shadow-sm">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Vehicle History</h3>
          <div className="space-y-lg">
            {vehicleHistory.map((v, idx) => (
              <div key={idx} className="flex gap-md items-start">
                <div className="relative">
                  <div className={`w-2 h-2 ${v.current ? 'bg-primary' : 'bg-outline'} rounded-full absolute -left-1 top-2 ring-4 ring-surface-container-lowest`}></div>
                  {idx < vehicleHistory.length - 1 && <div className="h-16 w-px bg-surface-variant ml-[3px]"></div>}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{v.name}</p>
                      <p className="text-body-sm text-outline">Unit: {v.unit} • Illinois Plate: {v.plate}</p>
                    </div>
                    {v.current && (
                      <span className="bg-primary-container/10 text-primary-container px-md py-0.5 rounded-full text-[10px] font-bold uppercase">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-outline-variant mt-1">Assigned: {v.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-lg rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-sm text-headline-sm">Recent Trips</h3>
            <button className="text-outline font-bold text-sm hover:text-primary transition-colors">View All Logs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container border-b border-surface-variant">
                  <th className="px-md py-sm font-label-caps uppercase text-outline">Trip ID</th>
                  <th className="px-md py-sm font-label-caps uppercase text-outline">Route</th>
                  <th className="px-md py-sm font-label-caps uppercase text-outline">Date</th>
                  <th className="px-md py-sm font-label-caps uppercase text-outline text-right">Fuel Efficiency</th>
                  <th className="px-md py-sm font-label-caps uppercase text-outline text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {recentTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-md py-md font-bold">#{trip.id}</td>
                    <td className="px-md py-md">
                      <p className="text-body-sm font-medium">{trip.route}</p>
                      <p className="text-[10px] text-outline">{trip.corridor}</p>
                    </td>
                    <td className="px-md py-md text-body-sm">{trip.date}</td>
                    <td className={`px-md py-md text-right font-bold ${trip.efficient ? 'text-primary' : 'text-on-surface'}`}>{trip.efficiency}</td>
                    <td className="px-md py-md text-right">
                      <StatusBadge status={trip.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
