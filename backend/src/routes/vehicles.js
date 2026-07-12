import express from 'express';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getVehicles);
router.post('/', checkRole(['Fleet Manager']), createVehicle);
router.put('/:id', checkRole(['Fleet Manager']), updateVehicle);
router.delete('/:id', checkRole(['Fleet Manager']), deleteVehicle);

export default router;
