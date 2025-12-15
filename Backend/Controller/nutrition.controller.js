import { searchFood, getFoodDetails, calculatePortionNutrition } from '../utils/usdaHelper.js';

/**
 * Search for food in USDA database
 * GET /api/nutrition/search?query=pizza
 */
export const searchFoodInDatabase = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        console.log('Searching USDA for:', query);

        const results = await searchFood(query);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No foods found. Try a different search term.',
                data: {
                    foods: [],
                    query: query
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Foods found successfully',
            data: {
                foods: results,
                query: query
            }
        });

    } catch (error) {
        console.error('Food search error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to search for food',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get detailed nutrition information for a specific food
 * GET /api/nutrition/details/:fdcId
 */
export const getFoodNutrition = async (req, res) => {
    try {
        const { fdcId } = req.params;

        if (!fdcId) {
            return res.status(400).json({
                success: false,
                message: 'Food ID is required'
            });
        }

        console.log('Getting nutrition for FDC ID:', fdcId);

        const nutritionData = await getFoodDetails(fdcId);

        return res.status(200).json({
            success: true,
            message: 'Nutrition data retrieved successfully',
            data: nutritionData
        });

    } catch (error) {
        console.error('Get nutrition error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get nutrition data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Calculate nutrition for a specific portion
 * POST /api/nutrition/calculate
 * Body: { fdcId, portionGrams }
 */
export const calculateNutrition = async (req, res) => {
    try {
        const { fdcId, portionGrams } = req.body;

        if (!fdcId || !portionGrams) {
            return res.status(400).json({
                success: false,
                message: 'Food ID and portion size are required'
            });
        }

        if (portionGrams <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Portion size must be greater than 0'
            });
        }

        console.log(`Calculating nutrition for FDC ID: ${fdcId}, Portion: ${portionGrams}g`);

        // Get base nutrition data (per 100g)
        const nutritionData = await getFoodDetails(fdcId);

        // Calculate for specific portion
        const portionNutrition = calculatePortionNutrition(nutritionData, portionGrams);

        return res.status(200).json({
            success: true,
            message: 'Nutrition calculated successfully',
            data: portionNutrition
        });

    } catch (error) {
        console.error('Calculate nutrition error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to calculate nutrition',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};