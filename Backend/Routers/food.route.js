import { Router } from 'express';
import { identifyFood } from '../Controller/food.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = Router();

// Identify food from image - Protected route
router.post('/identify', auth, identifyFood);

export default router;