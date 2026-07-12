import express from 'express';
import { getVehicleROI } from '../controllers/reportController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/roi', checkRole(['Fleet Manager', 'Financial Analyst']), getVehicleROI);

export default router;
