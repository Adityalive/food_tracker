import { Router } from 'express';
import { 
    searchFoodInDatabase, 
    getFoodNutrition, 
    calculateNutrition 
} from '../Controller/nutrition.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = Router();

// Search for food - Protected route
router.get('/search', auth, searchFoodInDatabase);

// Get detailed nutrition for a specific food - Protected route
router.get('/details/:fdcId', auth, getFoodNutrition);

// Calculate nutrition for a specific portion - Protected route
router.post('/calculate', auth, calculateNutrition);

export default router;