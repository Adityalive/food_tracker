import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet'; // New library
import jpeg from 'jpeg-js';
import cloudinary from '../config/cloudinary.js'; 
import { searchFood, getFoodDetails } from '../utils/usdaHelper.js';

let model;

// --- LOAD MODEL ---
const loadModel = async () => {
    try {
        console.log("⏳ Loading MobileNet model...");
        // Load model + 1000 classes automatically
        model = await mobilenet.load({ version: 2, alpha: 1.0 });
        console.log("✅ MobileNet Model Loaded!");
    } catch (err) {
        console.error("❌ Model Load Failed:", err.message);
    }
};
loadModel();

// --- MAIN CONTROLLER ---
export const identifyFood = async (req, res) => {
    try {
        // 1. Validation
        if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });

        console.log("📸 Processing image...");

        let predictedLabel = "Unknown";
        let confidenceScore = 0;
        let nutritionInfo = null;

        // 2. AI PREDICTION
        if (model) {
            try {
                // Decode Image
                const rawImageData = jpeg.decode(req.file.buffer, { useTArray: true });

                // Create Tensor (Handle RGBA -> RGB automatically)
                // We create 4 channels, then slice off the Alpha channel
                const imageTensor = tf.tensor3d(rawImageData.data, [rawImageData.height, rawImageData.width, 4])
                    .slice([0, 0, 0], [-1, -1, 3]); 

                // Classify using MobileNet wrapper
                const predictions = await model.classify(imageTensor);
                
                // Get top result
                if (predictions && predictions.length > 0) {
                    predictedLabel = predictions[0].className.split(',')[0]; // Take first word
                    confidenceScore = predictions[0].probability;
                    console.log(`🧠 AI Detected: ${predictedLabel} (${(confidenceScore * 100).toFixed(1)}%)`);
                }

                imageTensor.dispose(); // Cleanup memory

            } catch (err) {
                console.error("⚠️ AI Error:", err.message);
            }
        }

        // 3. FETCH NUTRITION (USDA)
        if (predictedLabel !== "Unknown") {
            try {
                console.log(`🔎 Searching USDA for: ${predictedLabel}...`);
                const searchResults = await searchFood(predictedLabel);

                if (searchResults.length > 0) {
                    const bestMatchId = searchResults[0].fdcId;
                    const details = await getFoodDetails(bestMatchId);

                    nutritionInfo = {
                        calories: details.calories,
                        protein: details.protein,
                        fat: details.fat,
                        carbs: details.carbohydrates,
                        servingSize: 100,
                        unit: 'g'
                    };
                    console.log("✅ Nutrition data fetched!");
                }
            } catch (usdaError) {
                console.error("⚠️ USDA Error:", usdaError.message);
            }
        }

        // 4. UPLOAD TO CLOUDINARY
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder: 'food_tracker',
            resource_type: 'image'
        });

        // 5. SEND RESPONSE
        return res.status(200).json({
            success: true,
            message: 'Analysis complete',
            data: {
                foodName: predictedLabel,
                confidence: confidenceScore,
                imageUrl: uploadResponse.secure_url,
                nutrition: nutritionInfo || { 
                    calories: 0, protein: 0, fat: 0, carbs: 0, message: "No data found" 
                }
            }
        });

    } catch (error) {
        console.error('❌ Server Error:', error);
        return res.status(500).json({ error: error.message });
    }
};