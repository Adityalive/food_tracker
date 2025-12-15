import axios from 'axios';

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

/**
 * Search for food in USDA database
 * @param {string} foodName - Name of the food to search
 * @returns {Promise<Array>} - Array of food matches
 */
export const searchFood = async (foodName) => {
    try {
        const apiKey = process.env.USDA_API_KEY;
        
        const response = await axios.get(`${USDA_API_BASE}/foods/search`, {
            params: {
                api_key: apiKey,
                query: foodName,
                pageSize: 10, // Get top 10 results
                dataType: ['Survey (FNDDS)', 'Branded', 'Foundation', 'SR Legacy'] // All food types
            }
        });

        const foods = response.data.foods || [];

        // Format the results
        const formattedFoods = foods.map(food => ({
            fdcId: food.fdcId,
            description: food.description,
            brandName: food.brandName || null,
            dataType: food.dataType,
            score: food.score // Relevance score
        }));

        return formattedFoods;

    } catch (error) {
        console.error('USDA Search Error:', error.response?.data || error.message);
        throw new Error('Failed to search food in USDA database');
    }
};

/**
 * Get detailed nutrition data for a specific food
 * @param {number} fdcId - USDA Food Data Central ID
 * @returns {Promise<Object>} - Detailed nutrition information
 */
export const getFoodDetails = async (fdcId) => {
    try {
        const apiKey = process.env.USDA_API_KEY;
        
        const response = await axios.get(`${USDA_API_BASE}/food/${fdcId}`, {
            params: {
                api_key: apiKey
            }
        });

        const food = response.data;

        // Extract nutrients
        const nutrients = food.foodNutrients || [];

        // Helper function to find nutrient value
        const getNutrient = (nutrientName) => {
            const nutrient = nutrients.find(n => 
                n.nutrient?.name?.toLowerCase().includes(nutrientName.toLowerCase())
            );
            return nutrient ? nutrient.amount : 0;
        };

        // Build nutrition object
        const nutritionData = {
            fdcId: food.fdcId,
            description: food.description,
            dataType: food.dataType,
            servingSize: food.servingSize || 100,
            servingSizeUnit: food.servingSizeUnit || 'g',
            
            // Macronutrients per 100g
            calories: getNutrient('energy') || getNutrient('calories'),
            protein: getNutrient('protein'),
            carbohydrates: getNutrient('carbohydrate'),
            fat: getNutrient('total lipid') || getNutrient('fat'),
            fiber: getNutrient('fiber'),
            sugar: getNutrient('sugars'),
            
            // Optional micronutrients
            sodium: getNutrient('sodium'),
            cholesterol: getNutrient('cholesterol'),
            
            // Full nutrients list (for detailed view)
            allNutrients: nutrients.map(n => ({
                name: n.nutrient?.name,
                amount: n.amount,
                unit: n.nutrient?.unitName
            }))
        };

        return nutritionData;

    } catch (error) {
        console.error('USDA Details Error:', error.response?.data || error.message);
        throw new Error('Failed to get food details from USDA');
    }
};

/**
 * Calculate nutrition for a specific portion
 * @param {Object} nutritionData - Base nutrition data (per 100g)
 * @param {number} portionGrams - Portion size in grams
 * @returns {Object} - Calculated nutrition for the portion
 */
export const calculatePortionNutrition = (nutritionData, portionGrams) => {
    const multiplier = portionGrams / 100;

    return {
        description: nutritionData.description,
        portionSize: portionGrams,
        portionUnit: 'g',
        
        calories: Math.round(nutritionData.calories * multiplier),
        protein: Math.round(nutritionData.protein * multiplier * 10) / 10,
        carbohydrates: Math.round(nutritionData.carbohydrates * multiplier * 10) / 10,
        fat: Math.round(nutritionData.fat * multiplier * 10) / 10,
        fiber: Math.round(nutritionData.fiber * multiplier * 10) / 10,
        sugar: Math.round(nutritionData.sugar * multiplier * 10) / 10,
        sodium: Math.round(nutritionData.sodium * multiplier),
        cholesterol: Math.round(nutritionData.cholesterol * multiplier)
    };
};