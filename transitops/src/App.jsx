import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProtectedRoute from './routes/protectedRoute';

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
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard and Core App routes wrapped in Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default Redirect to Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Vehicles (Manager, Finance) */}
          <Route
            path="vehicles"
            element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst']}>
                <VehicleList />
              </ProtectedRoute>
            }
          />

          {/* Drivers (Manager, Safety) */}
          <Route
            path="drivers"
            element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer']}>
                <DriverList />
              </ProtectedRoute>
            }
          />

          {/* Trips (Manager, Driver) */}
          <Route
            path="trips"
            element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Driver']}>
                <TripList />
              </ProtectedRoute>
            }
          />

          {/* Maintenance (Manager) */}
          <Route
            path="maintenance"
            element={
              <ProtectedRoute allowedRoles={['Fleet Manager']}>
                <MaintenanceLogs />
              </ProtectedRoute>
            }
          />

          {/* Expenses (Manager, Finance, Driver) */}
          <Route
            path="expenses"
            element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst', 'Driver']}>
                <ExpenseLedger />
              </ProtectedRoute>
            }
          />

          {/* Reports (Manager, Finance) */}
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst']}>
                <AnalyticsReports />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

