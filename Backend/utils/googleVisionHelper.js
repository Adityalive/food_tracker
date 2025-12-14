import vision from '@google-cloud/vision';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Vision client with service account
const client = new vision.ImageAnnotatorClient({
    keyFilename: path.join(__dirname, '../config/credentials/google-vision-service-account.json')
});

/**
 * Identify food from image URL using Google Cloud Vision API
 * @param {string} imageUrl - URL of the image (from Cloudinary)
 * @returns {Promise<Array>} - Array of food predictions with confidence scores
 */
export const identifyFoodFromImage = async (imageUrl) => {
    try {
        // Perform label detection on the image
        const [result] = await client.labelDetection(imageUrl);
        const labels = result.labelAnnotations || [];

        // Filter food-related labels
        const foodKeywords = [
            'food', 'dish', 'cuisine', 'meal', 'ingredient',
            'pizza', 'burger', 'salad', 'chicken', 'rice', 'pasta',
            'fruit', 'vegetable', 'meat', 'bread', 'dessert', 'breakfast',
            'lunch', 'dinner', 'snack', 'drink', 'beverage', 'sandwich',
            'soup', 'noodle', 'seafood', 'beef', 'pork', 'cheese', 'egg'
        ];

        // Filter and format predictions
        const predictions = labels
            .filter(label => {
                // Keep label if it contains food-related keyword or has high confidence
                const description = label.description.toLowerCase();
                return foodKeywords.some(keyword => description.includes(keyword)) || label.score > 0.85;
            })
            .map(label => ({
                name: label.description,
                confidence: Math.round(label.score * 100) / 100 // Round to 2 decimals
            }))
            .filter(prediction => prediction.confidence >= 0.5) // Only keep predictions above 50%
            .slice(0, 5); // Return top 5

        return predictions;

    } catch (error) {
        console.error('Google Vision API Error:', error);
        throw new Error('Failed to identify food from image');
    }
};