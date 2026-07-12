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
import {  authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTrips);
router.post('/', createTrip);

router.get('/resources', getResources);

router.get('/:id', getTripById);
router.patch('/:id/dispatch', dispatchTrip);
router.patch('/:id/complete', completeTrip);
router.patch('/:id/cancel', cancelTrip);

export default router;