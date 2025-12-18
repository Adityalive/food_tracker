import { identifyFoodFromImage } from '../utils/replicateHelper.js';

export const identifyFood = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        console.log('🔍 Identifying food from:', imageUrl);

        let predictions = [];
        let aiSuccess = false;

        try {
            predictions = await identifyFoodFromImage(imageUrl);
            aiSuccess = true;
            console.log('✅ AI predictions:', predictions);
        } catch (aiError) {
            console.error('⚠️ AI failed:', aiError.message);
        }

        if (!aiSuccess || predictions.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'AI could not identify food. Please search manually.',
                data: {
                    predictions: [],
                    imageUrl: imageUrl,
                    fallbackToManualSearch: true
                }
            });
        }

        // Return multiple suggestions for user to choose
        return res.status(200).json({
            success: true,
            message: 'Food suggestions generated. Please select the correct one or search manually.',
            data: {
                predictions: predictions,
                topPrediction: predictions[0],
                imageUrl: imageUrl,
                instruction: 'Select one or search manually below'
            }
        });

    } catch (error) {
        console.error('Food identification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error processing image. Please search manually.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};