import React, { useState, useEffect } from 'react';
import { getVehicles, getDocumentTypes, uploadVehicleDocument } from '../../api/fleet';

const DocumentUpload = () => {
  const [vehicles, setVehicles] = useState([]);
  const [types, setTypes] = useState([]);
  const [file, setFile] = useState(null);
  const [vehicleId, setVehicleId] = useState('');
  const [typeId, setTypeId] = useState('');

  useEffect(() => {
    getVehicles().then(res => setVehicles(res.data));
    getDocumentTypes().then(res => setTypes(res.data));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    const formData = new FormData();
    formData.append('document', file);
    formData.append('vehicle_id', vehicleId);
    formData.append('document_type_id', typeId);

    await uploadVehicleDocument(formData);
    setFile(null);
    alert('Document uploaded successfully');
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
      <h3 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">Upload Vehicle Document</h3>
      <form onSubmit={handleUpload} className="space-y-5">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Select Vehicle</label>
          <select required className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all" onChange={e => setVehicleId(e.target.value)}>
            <option value="">Choose...</option>
            {vehicles.map(v => <option key={v.vehicle_id} value={v.vehicle_id}>{v.registration_number}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Document Type</label>
          <select required className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all" onChange={e => setTypeId(e.target.value)}>
            <option value="">Choose...</option>
            {types.map(t => <option key={t.document_type_id} value={t.document_type_id}>{t.type_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">File Attachment (PDF, Image)</label>
          <input required type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#E5F0E8] file:text-[#1C5B3E] hover:file:bg-[#d4e6db] transition-all" onChange={e => setFile(e.target.files[0])} />
        </div>
        <button type="submit" className="w-full py-2.5 bg-[#1C5B3E] hover:bg-[#154630] text-white font-bold rounded-lg mt-4 shadow-sm transition-colors">
          Upload Attachment
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;