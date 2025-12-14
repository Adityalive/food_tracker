import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

/**
 * Identify food from image URL using Hugging Face Food Recognition Model
 * @param {string} imageUrl - URL of the image (from Cloudinary)
 * @returns {Promise<Array>} - Array of food predictions with confidence scores
 */
export const identifyFoodFromImage = async (imageUrl) => {
    try {
        // Fetch the image from URL
        const response = await fetch(imageUrl);
        const imageBlob = await response.blob();

        // Call Hugging Face image classification
        const result = await hf.imageClassification({
            data: imageBlob,
            model: 'nateraw/food' // This is a popular food-101 model
            // Alternative: 'Kaludi/food-category-classification-v2.0' (12 categories)
        });

        // Format predictions
        const predictions = result
            .filter(item => item.score >= 0.1) // Filter low confidence
            .map(item => ({
                name: item.label.replace(/_/g, ' '), // Replace underscores with spaces
                confidence: Math.round(item.score * 100) / 100 // Round to 2 decimals
            }))
            .slice(0, 5); // Return top 5

        return predictions;

    } catch (error) {
        console.error('Hugging Face API Error:', error);
        
        // Handle specific errors
        if (error.message.includes('Rate limit')) {
            throw new Error('API rate limit exceeded. Please try again in a few minutes.');
        }
        
        if (error.message.includes('Invalid token')) {
            throw new Error('Invalid Hugging Face API token');
        }

        throw new Error('Failed to identify food from image');
    }
};