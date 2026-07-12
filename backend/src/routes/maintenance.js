import express from 'express';
import {
  getMaintenanceLogs,
  createMaintenanceLog,
  closeMaintenanceLog,
  getMaintenanceTypes,
  getMaintenanceLogById
} from '../controllers/maintenanceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getMaintenanceLogs);
router.get('/types', getMaintenanceTypes);
router.get('/:id', getMaintenanceLogById);
router.post('/', createMaintenanceLog);
router.put('/:id/close', closeMaintenanceLog);

export default router;