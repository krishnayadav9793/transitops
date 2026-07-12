import React, { useState } from 'react';

export const VehicleFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    registration: '',
    model: '',
    type: 'Heavy Duty Truck',
    capacity: '',
    fuelType: 'Diesel',
    odometer: '',
    region: 'Central Hub',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-lg">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-md">
            <div className="bg-primary-container p-sm rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined">directions_bus</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Add New Vehicle</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Register a new asset into the TransitOps fleet network.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-xl py-xl overflow-y-auto max-h-[716px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-xl gap-y-lg">
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Registration Number</label>
              <input name="registration" value={formData.registration} onChange={handleChange} className="px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest" placeholder="e.g. TR-2024-B882" type="text" />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Model / Make</label>
              <input name="model" value={formData.model} onChange={handleChange} className="px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest" placeholder="e.g. Scania R-Series" type="text" />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Vehicle Type</label>
              <div className="relative">
                <select name="type" value={formData.type} onChange={handleChange} className="w-full appearance-none px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest cursor-pointer">
                  <option>Heavy Duty Truck</option>
                  <option>Semi-Trailer</option>
                  <option>Light Commercial Vehicle</option>
                  <option>Last-Mile Van</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Capacity (Weight/Volume)</label>
              <div className="relative">
                <input name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest" placeholder="25.5" type="text" />
                <span className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">TONNES</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Fuel Type</label>
              <div className="relative">
                <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full appearance-none px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest cursor-pointer">
                  <option>Diesel</option>
                  <option>LNG / Biogas</option>
                  <option>Electric</option>
                  <option>Hydrogen</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Odometer Reading</label>
              <div className="relative">
                <input name="odometer" value={formData.odometer} onChange={handleChange} className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest" placeholder="0.00" type="number" />
                <span className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">KM</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Operating Region</label>
              <div className="relative">
                <select name="region" value={formData.region} onChange={handleChange} className="w-full appearance-none px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest cursor-pointer">
                  <option>Central Hub</option>
                  <option>Nordic Corridor</option>
                  <option>Coastal Logistics</option>
                  <option>Eastern Expressway</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Initial Status</label>
              <div className="flex items-center gap-md py-sm">
                {['Active', 'Standby', 'In Prep'].map((s) => (
                  <label key={s} className="flex items-center gap-xs cursor-pointer group">
                    <input type="radio" name="status" value={s} checked={formData.status === s} onChange={handleChange} className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" />
                    <span className="text-on-surface group-hover:text-primary transition-colors">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 mt-md">
              <div className="p-md bg-surface-container-low rounded-xl border border-dashed border-outline flex items-center justify-center gap-md group cursor-pointer hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">cloud_upload</span>
                <span className="text-on-surface-variant text-body-sm group-hover:text-on-surface transition-colors">Upload vehicle documents or photos (optional)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-xl py-lg bg-surface-container-low border-t border-outline-variant flex justify-end items-center gap-md">
          <button onClick={onClose} className="px-lg py-sm font-semibold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all">Cancel</button>
          <button className="bg-primary hover:bg-primary-container text-white px-xl py-sm rounded-lg font-semibold shadow-md transform active:scale-95 transition-all">Save Vehicle</button>
        </div>
      </div>
    </div>
  );
};

export default VehicleFormModal;
