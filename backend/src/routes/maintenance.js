import express from 'express';
import { getMaintenanceLogs, createMaintenanceRecord, closeMaintenanceRecord } from '../controllers/maintenanceController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getMaintenanceLogs);
router.post('/', checkRole(['Fleet Manager']), createMaintenanceRecord);
router.put('/:id/close', checkRole(['Fleet Manager']), closeMaintenanceRecord);

export default router;
