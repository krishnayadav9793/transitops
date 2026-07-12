import express from 'express';
import { getTrips, createTrip, updateTripStatus, getEligibleResources } from '../controllers/tripController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getTrips);
router.get('/resources', getEligibleResources);
router.post('/', checkRole(['Fleet Manager', 'Driver']), createTrip);
router.patch('/:id/status', checkRole(['Fleet Manager', 'Driver']), updateTripStatus);

export default router;