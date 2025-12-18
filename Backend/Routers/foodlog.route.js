import { Router } from 'express';
import {
    createFoodLog,
    getAllFoodLogs,
    getTodaysFoodLogs,
    deleteFoodLog
} from '../controllers/foodlog.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected (require authentication)

// Create new food log
router.post('/', auth, createFoodLog);

// Get all food logs for current user
router.get('/', auth, getAllFoodLogs);

// Get today's food logs with summary
router.get('/today', auth, getTodaysFoodLogs);

// Delete a food log
router.delete('/:id', auth, deleteFoodLog);

export default router;
