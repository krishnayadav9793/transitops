import React, { useEffect, useState } from 'react';
import { getMaintenanceLogs, createMaintenanceLog, closeMaintenanceLog, getMaintenanceTypes, getVehicles } from '../../api/fleet';

const MaintenanceLogs = () => {
  const [logs, setLogs] = useState([]);
  const [types, setTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicle_id: '', maintenance_type_id: '', problem_description: '', estimated_cost: '', start_date: '', expected_completion_date: ''
  });
  const [closingId, setClosingId] = useState(null);
  const [closeData, setCloseData] = useState({ actual_cost: '', actual_completion_date: '' });

  const fetchData = async () => {
    try {
      const [logs, types, vehs] = await Promise.all([
        getMaintenanceLogs(),
        getMaintenanceTypes(),
        getVehicles()
      ]);
      setLogs(logs);
      setTypes(types);
      setVehicles(vehs.filter(v => v.vehicle_statuses?.status_name !== 'RETIRED'));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createMaintenanceLog(formData);
      setFormData({ vehicle_id: '', maintenance_type_id: '', problem_description: '', estimated_cost: '', start_date: '', expected_completion_date: '' });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClose = async (e) => {
    e.preventDefault();
    try {
      await closeMaintenanceLog(closingId, closeData);
      setClosingId(null);
      setCloseData({ actual_cost: '', actual_completion_date: '' });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8 bg-[#F9FAFB] min-h-screen">
      <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
        <h3 className="font-bold text-xl mb-6 text-gray-900 tracking-tight">Log Maintenance</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Vehicle</label>
            <select required className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all" onChange={e => setFormData({...formData, vehicle_id: e.target.value})} value={formData.vehicle_id}>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v.vehicle_id} value={v.vehicle_id}>{v.registration_number}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
            <select required className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all" onChange={e => setFormData({...formData, maintenance_type_id: e.target.value})} value={formData.maintenance_type_id}>
              <option value="">Select Type</option>
              {types.map(t => <option key={t.maintenance_type_id} value={t.maintenance_type_id}>{t.type_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cost Estimate ($)</label>
            <input required type="number" step="0.01" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all" onChange={e => setFormData({...formData, estimated_cost: e.target.value})} value={formData.estimated_cost} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Start Date</label>
            <input required type="date" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all" onChange={e => setFormData({...formData, start_date: e.target.value})} value={formData.start_date} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Expected Completion</label>
            <input required type="date" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all" onChange={e => setFormData({...formData, expected_completion_date: e.target.value})} value={formData.expected_completion_date} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea required rows="3" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all resize-none" onChange={e => setFormData({...formData, problem_description: e.target.value})} value={formData.problem_description}></textarea>
          </div>
          <button type="submit" className="w-full py-2.5 mt-2 bg-[#1C5B3E] hover:bg-[#154630] text-white rounded-lg font-bold text-sm shadow-sm transition-colors">Create Record</button>
        </form>
      </div>

      <div className="col-span-12 lg:col-span-8 bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden h-fit">
        <div className="px-6 py-5 border-b border-gray-100 bg-[#F3F4F6]">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Active & Past Records</h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#F3F4F6]">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type / Problem</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {logs.map(log => (
                <tr key={log.maintenance_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">{log.vehicles?.registration_number}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{log.maintenance_types?.type_name}</div>
                    <div className="text-[13px] text-gray-500 mt-0.5">{log.problem_description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-[11px] font-bold rounded-md uppercase tracking-wide
                      ${log.maintenance_statuses?.status_name === 'IN_PROGRESS' ? 'bg-orange-50 text-orange-700' :
                        log.maintenance_statuses?.status_name === 'COMPLETED' ? 'bg-[#E5F0E8] text-[#1C5B3E]' :
                        'bg-gray-100 text-gray-600'}`}>
                      {log.maintenance_statuses?.status_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.maintenance_statuses?.status_name === 'IN_PROGRESS' && (
                      <button onClick={() => setClosingId(log.maintenance_id)} className="text-[#1C5B3E] hover:text-[#154630] text-sm font-bold transition-colors">Close Log</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {closingId && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-8 bg-white rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setClosingId(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#E5F0E8] p-2 rounded-lg text-[#1C5B3E]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 tracking-tight">Close Maintenance</h3>
            </div>
            <form onSubmit={handleClose} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Actual Cost ($)</label>
                <input required type="number" step="0.01" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all" onChange={e => setCloseData({...closeData, actual_cost: e.target.value})} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Actual Completion Date</label>
                <input required type="date" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1C5B3E]/20 focus:border-[#1C5B3E] transition-all" onChange={e => setCloseData({...closeData, actual_completion_date: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
                <button type="button" onClick={() => setClosingId(null)} className="px-5 py-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-[#1C5B3E] hover:bg-[#154630] text-white rounded-lg text-sm font-bold shadow-sm transition-colors">Confirm Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceLogs;