import React, { useState } from 'react';

const TripCompleteModal = ({ trip, onClose, onSubmit }) => {
  const [odometer, setOdometer] = useState('');
  const [fuel, setFuel] = useState('');

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="p-8 w-full max-w-md shadow-2xl rounded-2xl bg-white relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#E5F0E8] p-2 rounded-lg text-[#1C5B3E]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Complete Trip</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Final Odometer Reading (KM)</label>
            <input required type="number" placeholder="e.g. 154020" value={odometer} onChange={(e) => setOdometer(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Fuel Consumed (Liters)</label>
            <input required type="number" placeholder="e.g. 120" value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => onSubmit({ odometer_reading: odometer, fuel_quantity_liters: fuel })} className="px-5 py-2.5 text-sm bg-[#1C5B3E] hover:bg-[#154630] text-white font-medium rounded-lg transition-colors shadow-sm">Complete Trip</button>
        </div>
      </div>
    </div>
  );
};

export default TripCompleteModal;