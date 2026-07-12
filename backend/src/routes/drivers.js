import express from 'express';
import {
  getDrivers,
  getDriverMetadata,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
} from '../controllers/driverController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDrivers);
router.get('/meta', getDriverMetadata);
router.get('/:id', getDriverById);
router.post('/', checkRole(['Fleet Manager', 'Safety Officer']), createDriver);
router.put('/:id', checkRole(['Fleet Manager', 'Safety Officer']), updateDriver);
router.delete('/:id', checkRole(['Fleet Manager', 'Safety Officer']), deleteDriver);

export default router;
