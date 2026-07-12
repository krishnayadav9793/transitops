import express from 'express';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../controllers/driverController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDrivers);
router.post('/', checkRole(['Fleet Manager', 'Safety Officer']), createDriver);
router.put('/:id', checkRole(['Fleet Manager', 'Safety Officer']), updateDriver);
router.delete('/:id', checkRole(['Fleet Manager', 'Safety Officer']), deleteDriver);

export default router;
