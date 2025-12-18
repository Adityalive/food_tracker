import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;

/**
 * Load the MobileNet model (only loads once)
 */
export const initModel = async () => {
    if (!model) {
        console.log('⏳ Loading AI model...');
        model = await mobilenet.load();
        console.log('✅ AI model ready!');
    }
    return model;
};

/**
 * Analyze food image
 * @param {HTMLImageElement} imageElement - The img element with your food photo
 * @returns {Array} - Array of food predictions
 */
export const analyzeFood = async (imageElement) => {
    try {
        // Load model if not loaded
        const model = await initModel();
        
        console.log('🔍 Analyzing food...');
        
        // Get predictions
        const predictions = await model.classify(imageElement);
        
        console.log('Raw AI results:', predictions);

        // Food-related keywords for filtering
        const foodKeywords = [
            // Fruits
            'banana', 'apple', 'orange', 'strawberry', 'grape', 'pineapple',
            'watermelon', 'lemon', 'peach', 'cherry', 'berry', 'fruit',
            
            // Vegetables  
            'broccoli', 'carrot', 'corn', 'mushroom', 'cucumber', 'vegetable',
            
            // Meals
            'pizza', 'burger', 'sandwich', 'hot dog', 'taco', 'burrito',
            'sushi', 'ramen', 'noodle', 'pasta', 'salad',
            
            // Proteins
            'chicken', 'meat', 'steak', 'fish', 'egg',
            
            // Desserts
            'ice cream', 'cake', 'cookie', 'chocolate', 'candy',
            
            // Drinks
            'coffee', 'tea', 'smoothie', 'juice',
            
            // Other
            'food', 'dish', 'plate', 'meal', 'bread', 'rice', 'cheese'
        ];

        // Format and filter predictions
        const formatted = predictions.map(pred => {
            // Clean up the label
            // "banana, edible fruit" → "banana"
            const cleanName = pred.className.split(',')[0].trim().toLowerCase();
            
            return {
                name: cleanName,
                fullName: pred.className, // Keep original for reference
                confidence: Math.round(pred.probability * 100) / 100
            };
        });

        // Filter for food-related predictions
        const foodPredictions = formatted.filter(pred => 
            foodKeywords.some(keyword => pred.name.includes(keyword) || pred.fullName.toLowerCase().includes(keyword))
        );

        // If no food keywords found, return top 5 anyway
        const finalPredictions = foodPredictions.length > 0 
            ? foodPredictions.slice(0, 5)
            : formatted.slice(0, 5);

        console.log('✅ Food predictions:', finalPredictions);

        return finalPredictions;

    } catch (error) {
        console.error('❌ AI Error:', error);
        throw new Error('Failed to analyze image. Please search manually.');
    }
};