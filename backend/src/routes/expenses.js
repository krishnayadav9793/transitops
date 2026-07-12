import express from 'express';
import {
  getExpenses,
  getExpenseMetadata,
  createExpense,
  getFuelLogs,
  createFuelLog
} from '../controllers/expenseController.js';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getExpenses);
router.get('/meta', getExpenseMetadata);
router.post('/', checkRole(['Fleet Manager', 'Financial Analyst']), createExpense);
router.get('/fuel', getFuelLogs);
router.post('/fuel', checkRole(['Fleet Manager', 'Driver', 'Financial Analyst']), createFuelLog);

export default router;

