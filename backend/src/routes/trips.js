import express from 'express';
import { getTrips, createTrip, updateTripStatus, getEligibleResources } from '../controllers/tripController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getTrips);
router.post('/', createTrip);
router.patch('/:id/status', updateTripStatus);
router.get('/resources', getEligibleResources);

export default router;