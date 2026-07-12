import express from 'express';
import { getMaintenanceLogs, createMaintenanceLog, closeMaintenanceLog, getMaintenanceTypes } from '../controllers/maintenanceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getMaintenanceLogs);
router.post('/', createMaintenanceLog);
router.put('/:id/close', closeMaintenanceLog);
router.get('/types', getMaintenanceTypes);

export default router;