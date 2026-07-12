import express from 'express';
import authRoutes from './auth.js';
import vehicleRoutes from './vehicles.js';
import driverRoutes from './drivers.js';
import tripRoutes from './trips.js';
import maintenanceRoutes from './maintenance.js';
import expenseRoutes from './expenses.js';
import reportRoutes from './reports.js';
import dashboardRoutes from './dashboard.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/trips', tripRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/expenses', expenseRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
