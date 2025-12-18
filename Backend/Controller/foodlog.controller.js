import FoodLog from '../Models/Foodlog.model.js';
import mongoose from 'mongoose';

/**
 * Create new food log entry
 * POST /api/foodlog
 */
export const createFoodLog = async (req, res) => {
    try {
        const {
            imageUrl,
            foodName,
            portionSize,
            calories,
            protein,
            carbohydrates,
            fat,
            fiber,
            sugar,
            confidence,
            mealType
        } = req.body;

        // Validate required fields
        if (!imageUrl || !foodName || !portionSize || calories === undefined || 
            protein === undefined || carbohydrates === undefined || fat === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: imageUrl, foodName, portionSize, and nutrition data are required'
            });
        }

        // Validate numeric values
        if (calories < 0 || protein < 0 || carbohydrates < 0 || fat < 0) {
            return res.status(400).json({
                success: false,
                message: 'Nutrition values cannot be negative'
            });
        }

        // Create new food log
        const foodLog = new FoodLog({
            userId: req.userId, // From auth middleware
            imageUrl,
            foodName,
            portionSize,
            calories,
            protein,
            carbohydrates,
            fat,
            fiber: fiber || 0,
            sugar: sugar || 0,
            confidence: confidence || 0,
            mealType: mealType || 'other'
        });

        // Save to database
        await foodLog.save();

        console.log('Food log created:', foodLog._id);

        return res.status(201).json({
            success: true,
            message: 'Food log created successfully',
            data: foodLog
        });

    } catch (error) {
        console.error('Create food log error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create food log',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get all food logs for current user
 * GET /api/foodlog
 */
export const getAllFoodLogs = async (req, res) => {
    try {
        // Find all logs for this user, sorted by newest first
        const foodLogs = await FoodLog.find({ userId: req.userId })
            .sort({ createdAt: -1 }); // Newest first

        return res.status(200).json({
            success: true,
            message: 'Food logs retrieved successfully',
            data: {
                logs: foodLogs,
                count: foodLogs.length
            }
        });

    } catch (error) {
        console.error('Get food logs error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve food logs',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get today's food logs with summary
 * GET /api/foodlog/today
 */
export const getTodaysFoodLogs = async (req, res) => {
    try {
        // Get start and end of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Find logs from today
        const todaysLogs = await FoodLog.find({
            userId: req.userId,
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ createdAt: -1 });

        // Calculate totals
        const summary = todaysLogs.reduce((totals, log) => {
            return {
                totalCalories: totals.totalCalories + log.calories,
                totalProtein: totals.totalProtein + log.protein,
                totalCarbs: totals.totalCarbs + log.carbohydrates,
                totalFat: totals.totalFat + log.fat,
                totalFiber: totals.totalFiber + log.fiber,
                totalSugar: totals.totalSugar + log.sugar,
            };
        }, {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            totalFiber: 0,
            totalSugar: 0,
        });

        // Round to 1 decimal place
        Object.keys(summary).forEach(key => {
            summary[key] = Math.round(summary[key] * 10) / 10;
        });

        return res.status(200).json({
            success: true,
            message: "Today's food logs retrieved successfully",
            data: {
                date: startOfDay.toISOString().split('T')[0],
                logs: todaysLogs,
                count: todaysLogs.length,
                summary: summary
            }
        });

    } catch (error) {
        console.error("Get today's logs error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve today's food logs",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Delete a food log entry
 * DELETE /api/foodlog/:id
 */
export const deleteFoodLog = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid food log ID'
            });
        }

        // Find the food log
        const foodLog = await FoodLog.findById(id);

        if (!foodLog) {
            return res.status(404).json({
                success: false,
                message: 'Food log not found'
            });
        }

        // Check if user owns this log
        if (foodLog.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this food log'
            });
        }

        // Delete the log
        await FoodLog.findByIdAndDelete(id);

        console.log('Food log deleted:', id);

        return res.status(200).json({
            success: true,
            message: 'Food log deleted successfully'
        });

    } catch (error) {
        console.error('Delete food log error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete food log',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};