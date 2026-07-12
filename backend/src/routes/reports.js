import express from 'express';
import { getReports } from '../controllers/reportController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', checkRole(['Fleet Manager', 'Financial Analyst']), getReports);

export default router;
