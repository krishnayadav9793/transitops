import React, { useState } from 'react';

export const TripFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    source: 'San Francisco Port, Terminal 4',
    destination: '',
    cargoWeight: 12450,
    distance: 482,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-lg">
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-md">
            <div className="bg-primary-container p-sm rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined">route</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Plan New Trip</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Create a new dispatch with route, resources, and financials.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-xl space-y-lg">
          <section className="bg-white rounded-xl border border-outline-variant/30 overflow-hidden">
            <div className="px-xl py-lg bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-md">
                <span className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">1</span>
                <h3 className="font-headline-sm text-headline-sm">Trip Logistics & Cargo</h3>
              </div>
              <span className="material-symbols-outlined text-primary">local_shipping</span>
            </div>
            <div className="p-xl grid grid-cols-1 sm:grid-cols-2 gap-lg">
              <div className="space-y-sm">
                <label className="font-body-sm text-on-surface-variant block">Source Location</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-primary">location_on</span>
                  <input name="source" value={formData.source} onChange={handleChange} className="w-full pl-10 pr-md py-md bg-surface-bright border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" />
                </div>
              </div>
              <div className="space-y-sm">
                <label className="font-body-sm text-on-surface-variant block">Destination Hub</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-secondary">flag</span>
                  <input name="destination" value={formData.destination} onChange={handleChange} className="w-full pl-10 pr-md py-md bg-surface-bright border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Search destination..." type="text" />
                </div>
              </div>
              <div className="space-y-sm">
                <label className="font-body-sm text-on-surface-variant block">Cargo Weight (kg)</label>
                <div className="flex items-center">
                  <input name="cargoWeight" value={formData.cargoWeight} onChange={handleChange} className="flex-1 px-md py-md bg-surface-bright border border-outline-variant rounded-l-lg font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="number" />
                  <span className="px-md py-md bg-surface-container-high border border-l-0 border-outline-variant rounded-r-lg text-body-sm font-bold text-on-surface-variant">KG</span>
                </div>
              </div>
              <div className="space-y-sm">
                <label className="font-body-sm text-on-surface-variant block">Estimated Distance (km)</label>
                <div className="flex items-center">
                  <input name="distance" value={formData.distance} onChange={handleChange} className="flex-1 px-md py-md bg-surface-bright border border-outline-variant rounded-l-lg font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="number" />
                  <span className="px-md py-md bg-surface-container-high border border-l-0 border-outline-variant rounded-r-lg text-body-sm font-bold text-on-surface-variant">KM</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-outline-variant/30 overflow-hidden">
            <div className="px-xl py-lg bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-md">
                <span className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">2</span>
                <h3 className="font-headline-sm text-headline-sm">Resource Assignment</h3>
              </div>
              <span className="material-symbols-outlined text-primary">assignment_ind</span>
            </div>
            <div className="p-xl grid grid-cols-1 sm:grid-cols-2 gap-lg">
              <div className="space-y-md">
                <label className="font-body-sm text-on-surface-variant block">Assigned Vehicle</label>
                <div className="p-md border border-outline-variant rounded-lg hover:border-primary cursor-pointer transition-all flex items-center gap-md group">
                  <div className="h-12 w-12 bg-surface-container rounded flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined" style={{ fontSize: 32 }}>local_shipping</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-md font-bold text-on-surface">Freightliner Cascadia #882</p>
                    <p className="text-body-sm text-on-surface-variant">Capacity: 15,000kg • Status: Ready</p>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">expand_more</span>
                </div>
              </div>
              <div className="space-y-md">
                <label className="font-body-sm text-on-surface-variant block">Assigned Driver</label>
                <div className="p-md border border-outline-variant rounded-lg hover:border-primary cursor-pointer transition-all flex items-center gap-md group">
                  <div className="h-12 w-12 rounded-full bg-surface-container-higher flex items-center justify-center text-on-surface-variant border-2 border-surface-container">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-md font-bold text-on-surface">Marcus Thorne</p>
                    <p className="text-body-sm text-on-surface-variant">ID: 0492-MT • Rating: 4.9★</p>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">expand_more</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-outline-variant/30 overflow-hidden">
            <div className="px-xl py-lg bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-md">
                <span className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">3</span>
                <h3 className="font-headline-sm text-headline-sm">Trip Financials</h3>
              </div>
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
            <div className="p-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-xl">
                <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Base Revenue</p>
                  <div className="flex items-baseline gap-xs">
                    <span className="text-body-sm font-bold text-primary">$</span>
                    <span className="font-kpi-md text-kpi-md">3,450.00</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Fuel Surcharge</p>
                  <div className="flex items-baseline gap-xs">
                    <span className="text-body-sm font-bold text-primary">$</span>
                    <span className="font-kpi-md text-kpi-md">412.50</span>
                  </div>
                </div>
                <div className="bg-primary p-lg rounded-xl shadow-lg shadow-primary-container/20">
                  <p className="font-label-caps text-label-caps text-on-primary/80 mb-xs uppercase">Total Trip Value</p>
                  <div className="flex items-baseline gap-xs text-white">
                    <span className="text-body-sm font-bold">$</span>
                    <span className="font-kpi-lg text-kpi-lg">3,862.50</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="px-xl py-lg bg-surface-container-low border-t border-outline-variant flex justify-end items-center gap-md">
          <button onClick={onClose} className="px-xl py-md font-body-md font-bold text-primary hover:bg-primary/5 rounded-lg transition-all">Discard Draft</button>
          <button className="px-3xl py-md bg-primary text-white font-body-md font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center gap-md">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            Execute Dispatch
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripFormModal;
