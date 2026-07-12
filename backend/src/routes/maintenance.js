import express from 'express';
import { getMaintenanceLogs, createMaintenanceLog, closeMaintenanceLog, getMaintenanceTypes } from '../controllers/maintenanceController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getMaintenanceLogs);
router.post('/', createMaintenanceLog);
router.put('/:id/close', closeMaintenanceLog);
router.get('/types', getMaintenanceTypes);

export default router;