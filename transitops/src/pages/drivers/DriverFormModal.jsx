import React from 'react';

export const DriverFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold">Add / Edit Driver</h2>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default DriverFormModal;
