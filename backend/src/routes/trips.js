import express from 'express';
import {
  getTrips,
  createTrip,
  updateTripStatus,
  getResources,
  getTripById
} from '../controllers/tripController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getTrips);
router.get('/resources', getResources);
router.get('/:id', getTripById);
router.post('/', checkRole(['Admin', 'Fleet Manager', 'Driver', 'User']), createTrip);
router.patch('/:id/status', checkRole(['Admin', 'Fleet Manager', 'Driver', 'User']), updateTripStatus);

export default router;
