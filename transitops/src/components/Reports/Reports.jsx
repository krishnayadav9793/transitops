import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [vehicleROI, setVehicleROI] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/reports/roi', { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setVehicleROI(data);
      } catch (err) {}
    };
    fetchAnalytics();
  }, []);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Registration,Revenue,Costs,Acquisition,ROI\n" 
      + vehicleROI.map(v => `${v.registration},${v.revenue},${v.costs},${v.acquisition},${v.roi}%`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transitops_roi_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#F9FAFB] min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Exportable ROI metrics across the TransitOps fleet</p>
        </div>
        <button onClick={exportCSV} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Export CSV
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Vehicle ROI Data Table</h2>
        </div>
        <div className="w-full overflow-x-auto">
           <table className="min-w-full divide-y divide-gray-100">
             <thead className="bg-[#F3F4F6]">
               <tr>
                 <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Registration</th>
                 <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Generated Revenue</th>
                 <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Maint. + Fuel Costs</th>
                 <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Purchase Cost</th>
                 <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider">ROI %</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50 bg-white">
               {vehicleROI.map((v, i) => (
                 <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{v.registration}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C5B3E] font-semibold">${v.revenue.toFixed(2)}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">${v.costs.toFixed(2)}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">${v.acquisition.toFixed(2)}</td>
                   <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${Number(v.roi) >= 0 ? 'text-[#1C5B3E]' : 'text-red-600'}`}>
                     {v.roi}%
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;