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
    const [logsRes, typesRes, vehRes] = await Promise.all([getMaintenanceLogs(), getMaintenanceTypes(), getVehicles()]);
    setLogs(logsRes.data);
    setTypes(typesRes.data);
    setVehicles(vehRes.data.filter(v => v.vehicle_statuses.status_name !== 'RETIRED'));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createMaintenanceLog(formData);
    setFormData({ vehicle_id: '', maintenance_type_id: '', problem_description: '', estimated_cost: '', start_date: '', expected_completion_date: '' });
    fetchData();
  };

  const handleClose = async (e) => {
    e.preventDefault();
    await closeMaintenanceLog(closingId, closeData);
    setClosingId(null);
    setCloseData({ actual_cost: '', actual_completion_date: '' });
    fetchData();
  };

  return (
    <div className="space-y-lg p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8">
      <div className="col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 h-fit">
        <h3 className="font-headline-sm text-headline-sm mb-6 text-on-surface">Log Maintenance</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Vehicle</label>
            <select required className="w-full p-2 border border-outline-variant rounded-md text-sm bg-white" onChange={e => setFormData({...formData, vehicle_id: e.target.value})} value={formData.vehicle_id}>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v.vehicle_id} value={v.vehicle_id}>{v.registration_number}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Type</label>
            <select required className="w-full p-2 border border-outline-variant rounded-md text-sm bg-white" onChange={e => setFormData({...formData, maintenance_type_id: e.target.value})} value={formData.maintenance_type_id}>
              <option value="">Select Type</option>
              {types.map(t => <option key={t.maintenance_type_id} value={t.maintenance_type_id}>{t.type_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Cost Estimate</label>
            <input required type="number" className="w-full p-2 border border-outline-variant rounded-md text-sm" onChange={e => setFormData({...formData, estimated_cost: e.target.value})} value={formData.estimated_cost} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Start Date</label>
            <input required type="date" className="w-full p-2 border border-outline-variant rounded-md text-sm" onChange={e => setFormData({...formData, start_date: e.target.value})} value={formData.start_date} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Description</label>
            <textarea required className="w-full p-2 border border-outline-variant rounded-md text-sm" onChange={e => setFormData({...formData, problem_description: e.target.value})} value={formData.problem_description}></textarea>
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-on-primary rounded-md font-bold text-sm">Create Record</button>
        </form>
      </div>

      <div className="col-span-8 bg-surface-container-lowest shadow-sm border border-outline-variant/30 rounded-xl overflow-hidden h-fit">
         <div className="px-6 py-5 border-b border-outline-variant/30 bg-surface-container">
           <h2 className="text-lg font-bold text-on-surface">Active & Past Records</h2>
         </div>
         <table className="min-w-full divide-y divide-outline-variant/50">
            <thead className="bg-surface-container">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase">Type / Problem</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 bg-surface-container-lowest">
              {logs.map(log => (
                <tr key={log.maintenance_id}>
                  <td className="px-4 py-3 text-sm font-bold text-on-surface">{log.vehicles?.registration_number}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{log.maintenance_types?.type_name}</div>
                    <div className="text-xs text-on-surface-variant">{log.problem_description}</div>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-primary">{log.maintenance_statuses?.status_name}</td>
                  <td className="px-4 py-3">
                    {log.maintenance_statuses?.status_name === 'IN_PROGRESS' && (
                       <button onClick={() => setClosingId(log.maintenance_id)} className="text-blue-600 text-sm font-bold">Close Log</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
         </table>
      </div>

      {closingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="p-6 bg-white rounded-xl w-96">
            <h3 className="font-bold text-lg mb-4">Close Maintenance</h3>
            <form onSubmit={handleClose}>
              <input required type="number" placeholder="Actual Cost" className="w-full p-2 mb-3 border rounded text-sm" onChange={e => setCloseData({...closeData, actual_cost: e.target.value})} />
              <input required type="date" className="w-full p-2 mb-4 border rounded text-sm" onChange={e => setCloseData({...closeData, actual_completion_date: e.target.value})} />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setClosingId(null)} className="px-4 py-2 bg-gray-100 rounded text-sm font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded text-sm font-medium">Confirm Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceLogs;