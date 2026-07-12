import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ScheduleMaintenance = () => {
  const [formData, setFormData] = useState({
    vehicleSearch: '',
    serviceType: '',
    mechanic: '',
    startDate: '',
    completionDate: '',
    estimatedCost: '',
    urgent: false,
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="space-y-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-lg">
        <div>
          <nav className="flex items-center space-x-sm mb-xs text-on-surface-variant font-body-sm">
            <Link to="/maintenance" className="hover:text-primary">Maintenance</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">New Record</span>
          </nav>
          <h2 className="font-headline-lg text-on-surface">Create Maintenance Record</h2>
        </div>
        <div className="flex space-x-md">
          <button className="px-lg py-md border border-outline text-on-surface-variant rounded-lg font-bold hover:bg-surface-container-low transition-colors">Cancel</button>
          <button className="px-lg py-md bg-primary-container text-on-primary rounded-lg font-bold shadow-md hover:shadow-lg transition-all">Submit Record</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <section className="col-span-1 lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl p-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
            <div className="space-y-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-caps text-on-surface-variant">Select Vehicle</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input name="vehicleSearch" value={formData.vehicleSearch} onChange={handleChange} className="w-full pl-10 pr-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors" placeholder="Search by VIN or Plate..." type="text" />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">e.g. EB-2049, MB-4022</p>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-on-surface-variant">Service Type</label>
                  <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary appearance-none transition-colors">
                    <option value="">Select Category</option>
                    <option value="routine">Routine Inspection</option>
                    <option value="engine">Engine & Powertrain</option>
                    <option value="braking">Braking System</option>
                    <option value="electrical">Electrical & Sensors</option>
                    <option value="emergency">Emergency Repair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-caps text-on-surface-variant">Assigned Mechanic</label>
                  <select name="mechanic" value={formData.mechanic} onChange={handleChange} className="w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors">
                    <option value="">Select Technician</option>
                    <option>David Chen</option>
                    <option>Sarah Jenkins</option>
                    <option>Marcus Aurelio</option>
                  </select>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-on-surface-variant">Start Date</label>
                  <input name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors" type="date" />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-on-surface-variant">Expected Completion</label>
                  <input name="completionDate" value={formData.completionDate} onChange={handleChange} className="w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors" type="date" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-caps text-on-surface-variant">Estimated Cost (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                    <input name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} className="w-full pl-8 pr-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors" placeholder="0.00" type="number" />
                  </div>
                </div>
                <div className="space-y-xs flex items-center pt-xl">
                  <label className="flex items-center space-x-md cursor-pointer group">
                    <input name="urgent" checked={formData.urgent} onChange={handleChange} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                    <span className="font-body-md text-on-surface select-none ml-sm">Priority/Urgent Repair Request</span>
                  </label>
                </div>
              </div>

              <div className="space-y-xs">
                <label className="font-label-caps text-on-surface-variant">Description & Work Notes</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-primary transition-colors" placeholder="Detail the specific faults, parts required, and diagnostic results..." rows="5"></textarea>
              </div>

              <div className="border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center space-y-md bg-surface-bright">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">cloud_upload</span>
                <div className="text-center">
                  <p className="font-bold text-on-surface">Upload Diagnostic Reports or Images</p>
                  <p className="text-body-sm text-on-surface-variant">Drag and drop files or click to browse (Max 10MB)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="col-span-1 lg:col-span-4 space-y-xl">
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-headline-sm text-on-surface">Vehicle Health</h3>
              <span className="px-sm py-xs bg-error-container text-on-error-container text-[10px] font-bold rounded uppercase tracking-tighter">Needs Attention</span>
            </div>
            <div className="flex items-start space-x-md mb-xl">
              <div className="w-24 h-24 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant">directions_bus</span>
              </div>
              <div>
                <p className="font-headline-sm text-on-surface">EB-2049</p>
                <p className="text-body-sm text-on-surface-variant">2023 EV-Transit High-Cap</p>
                <p className="text-[11px] font-bold text-secondary mt-xs">VIN: 1HGCM8263...928</p>
              </div>
            </div>
            <div className="space-y-md">
              <div className="flex items-start space-x-md p-md bg-error-container/20 rounded-lg border border-error/10">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                <div>
                  <p className="text-body-sm font-bold text-on-error-container">Critical: Brake Wear</p>
                  <p className="text-[11px] text-on-error-container/80">Sensor 4B reports pads at 12% thickness. Immediate replacement advised.</p>
                </div>
              </div>
              <div className="flex items-start space-x-md p-md bg-secondary-container/20 rounded-lg border border-secondary/10">
                <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <div>
                  <p className="text-body-sm font-bold text-on-secondary-container">Upcoming: Filter Cycle</p>
                  <p className="text-[11px] text-on-secondary-container/80">Cabin air filtration unit due for scheduled swap in 1,200 miles.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant">
            <h3 className="font-headline-sm text-on-surface mb-lg">Service History</h3>
            <div className="space-y-lg relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
              {[
                { date: 'Oct 14, 2023', title: 'Annual Safety Audit', desc: 'Certified by Inspector H. Vance. No faults found.' },
                { date: 'July 22, 2023', title: 'Tire Rotation & Alignment', desc: 'Standard routine service. All tires within spec.' },
                { date: 'Mar 05, 2023', title: 'Software Patch v4.2.1', desc: 'Energy management system update applied.' },
              ].map((item, idx) => (
                <div key={idx} className="relative pl-xl">
                  <div className={`absolute left-0 top-1 w-6 h-6 bg-surface-container-lowest rounded-full border-2 flex items-center justify-center z-10 ${idx === 0 ? 'border-primary' : 'border-outline-variant'}`}>
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                  </div>
                  <p className="text-[11px] font-label-caps text-on-surface-variant">{item.date}</p>
                  <p className="text-body-md font-bold">{item.title}</p>
                  <p className="text-[12px] text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-xl text-primary font-bold text-body-sm hover:underline flex items-center justify-center space-x-xs">
              <span>View Full History</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ScheduleMaintenance;
