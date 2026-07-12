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