import express from 'express';
import { getVehicleROI } from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/roi', getVehicleROI);

export default router;