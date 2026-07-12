import React, { useState } from 'react';

export const TripCompleteModal = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState('');
  const [mileage, setMileage] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-lg">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-md">
            <div className="bg-primary-container p-sm rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Complete Trip</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Finalize this trip and record delivery details.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-xl space-y-lg">
          <div className="flex flex-col gap-xs">
            <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Trip ID</label>
            <input className="px-md py-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant font-body-md cursor-not-allowed" value="TRK-8842-X" disabled type="text" />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Final Odometer Reading (km)</label>
            <input value={mileage} onChange={(e) => setMileage(e.target.value)} className="px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest" placeholder="e.g. 42,850" type="number" />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-body-sm text-body-sm text-on-surface-variant ml-xs">Completion Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface bg-surface-container-lowest resize-none" placeholder="Any delivery notes, incidents, or remarks..." rows="4" />
          </div>
          <div className="p-md bg-secondary/5 border border-secondary/10 rounded-lg flex items-start gap-md">
            <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
            <p className="text-body-sm text-on-surface-variant">Completing this trip will update the vehicle status, driver logs, and generate final billing.</p>
          </div>
        </div>

        <div className="px-xl py-lg bg-surface-container-low border-t border-outline-variant flex justify-end items-center gap-md">
          <button onClick={onClose} className="px-lg py-sm font-semibold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all">Cancel</button>
          <button className="bg-primary hover:bg-primary-container text-white px-xl py-sm rounded-lg font-semibold shadow-md transform active:scale-95 transition-all flex items-center gap-sm">
            <span className="material-symbols-outlined">check</span>
            Complete Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCompleteModal;
