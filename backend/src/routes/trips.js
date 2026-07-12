<<<<<<< HEAD
import express from 'express';
import { 
    getTrips, 
    createTrip, 
    getResources, 
    dispatchTrip, 
    completeTrip, 
    cancelTrip, 
    getTripById 
} from '../controllers/tripController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Secure all trip routes
router.use(authMiddleware);

// Core fetching & creation
router.get('/', getTrips);
router.post('/', createTrip);

// Dropdown data (MUST be above /:id)
router.get('/resources', getResources);

// ID-specific routes
router.get('/:id', getTripById);
router.patch('/:id/dispatch', dispatchTrip);
router.patch('/:id/complete', completeTrip);
router.patch('/:id/cancel', cancelTrip);

export default router;
=======
import express from 'express';
import {
  getTrips,
  createTrip,
  updateTripStatus,
  getEligibleResources,
  getTripById
} from '../controllers/tripController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getTrips);
router.get('/resources', getEligibleResources);
router.get('/:id', getTripById);
router.post('/', checkRole(['Admin', 'Fleet Manager', 'Driver', 'User']), createTrip);
router.patch('/:id/status', checkRole(['Admin', 'Fleet Manager', 'Driver', 'User']), updateTripStatus);

export default router;
>>>>>>> 30fefbefc835956e67a9056efd9495b0c7cb53d0
