import { identifyFoodFromImage } from '../utils/huggingFaceHelper.js';

/**
 * Identify food from uploaded image
 * POST /api/food/identify
 */
export const identifyFood = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        // Validate imageUrl
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        // Validate URL format
        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid image URL format'
            });
        }

        // Call Hugging Face API
        const predictions = await identifyFoodFromImage(imageUrl);

        // Check if any food detected
        if (predictions.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No food detected in image. Please try another image or enter food manually.',
                data: {
                    predictions: [],
                    imageUrl: imageUrl
                }
            });
        }

        // Return predictions
        return res.status(200).json({
            success: true,
            message: 'Food identified successfully',
            data: {
                topPrediction: predictions[0],
                predictions: predictions,
                imageUrl: imageUrl
            }
        });

    } catch (error) {
        console.error('Food identification error:', error);

        // Check if it's a rate limit error
        if (error.message.includes('rate limit')) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again in a few minutes.'
            });
        }

        // Check if it's an API token error
        if (error.message.includes('token')) {
            return res.status(401).json({
                success: false,
                message: 'API authentication failed. Please contact support.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to identify food. Please try again or enter food manually.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};