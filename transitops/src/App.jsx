import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';

// Page imports
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import VehicleList from './pages/vehicles/VehicleList';
import DriverList from './pages/drivers/DriverList';
import TripList from './pages/trips/TripList';
import MaintenanceLogs from './pages/maintenance/MaintenanceLogs';
import ExpenseLedger from './pages/expenses/ExpenseLedger';
import AnalyticsReports from './pages/reports/AnalyticsReports';

function App() {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />

      
      <Route path="/" element={<Layout />}>
        
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="vehicles" element={<VehicleList />} />
        <Route path="drivers" element={<DriverList />} />
        <Route path="trips" element={<TripList />} />
        <Route path="maintenance" element={<MaintenanceLogs />} />
        <Route path="expenses" element={<ExpenseLedger />} />
        <Route path="reports" element={<AnalyticsReports />} />
      </Route>

      {/* Catch-all fallback redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
