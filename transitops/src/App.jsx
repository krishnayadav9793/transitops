import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProtectedRoute from './routes/protectedRoute';

// Page imports
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import VehicleList from './pages/vehicles/VehicleList';
import DriverList from './pages/drivers/DriverList';
import TripList from './pages/trips/TripList';
import MaintenanceLogs from './pages/vehicles/MaintenanceLogs'; // <-- CORRECTED IMPORT PATH
import ExpenseLedger from './pages/expenses/ExpenseLedger';
import AnalyticsReports from './pages/reports/AnalyticsReports';
import VehicleDetails from './pages/vehicles/VehicleDetails';
import DriverProfile from './pages/drivers/DriverProfile';
import TripDetails from './pages/trips/TripDetails';
import MaintenanceDetails from './pages/maintenance/MaintenanceDetails';
import ScheduleMaintenance from './pages/maintenance/ScheduleMaintenance';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e1e24', color: '#f3f4f6', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' } }} />
      <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />



      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />

        {/* Vehicles (Manager, Finance, Vehicle Owner) */}
        <Route
          path="vehicles"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'Vehicle Owner', 'Financial Analyst']}>
              <VehicleList />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicles/:id"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'Vehicle Owner', 'Financial Analyst']}>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />

        {/* Drivers (Manager, Safety) */}
        <Route
          path="drivers"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'Safety Officer']}>
              <DriverList />
            </ProtectedRoute>
          }
        />
        <Route
          path="drivers/:id"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'Safety Officer']}>
              <DriverProfile />
            </ProtectedRoute>
          }
        />

        {/* Trips (User, Driver, Manager) */}
        <Route
          path="trips"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'User', 'Driver']}>
              <TripList />
            </ProtectedRoute>
          }
        />
        <Route
          path="trips/:id"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'User', 'Driver']}>
              <TripDetails />
            </ProtectedRoute>
          }
        />

        {/* Maintenance (Manager, Vehicle Owner) */}
        <Route
          path="maintenance"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'Vehicle Owner']}>
              <MaintenanceLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="maintenance/schedule"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'Vehicle Owner']}>
              <ScheduleMaintenance />
            </ProtectedRoute>
          }
        />
        <Route
          path="maintenance/:id"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'Vehicle Owner']}>
              <MaintenanceDetails />
            </ProtectedRoute>
          }
        />

        {/* Expenses (Manager, Finance, Driver, Vehicle Owner) */}
        <Route
          path="expenses"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'Vehicle Owner', 'Financial Analyst', 'Driver']}>
              <ExpenseLedger />
            </ProtectedRoute>
          }
        />

        {/* Reports (Manager, Finance, Vehicle Owner) */}
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager', 'Vehicle Owner', 'Financial Analyst']}>
              <AnalyticsReports />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </>
  );

}

export default App;