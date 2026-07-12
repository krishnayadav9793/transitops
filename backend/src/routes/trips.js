import express from 'express';
import { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip } from '../controllers/tripController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTrips);
router.post('/', checkRole(['Fleet Manager', 'Driver']), createTrip);
router.patch('/:id/dispatch', checkRole(['Fleet Manager', 'Driver']), dispatchTrip);
router.patch('/:id/complete', checkRole(['Fleet Manager', 'Driver']), completeTrip);
router.patch('/:id/cancel', checkRole(['Fleet Manager', 'Driver']), cancelTrip);

export default router;
