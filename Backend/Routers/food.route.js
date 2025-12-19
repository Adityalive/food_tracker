import express from 'express';
import { identifyFood } from '../Controller/food.controller.js';
import uploadMiddleware from '../middleware/upload.middleware.js'; // Make sure this path is correct

const router = express.Router();

// ⚠️ IMPORTANT: 'image' must match the key used in Postman or Frontend FormData
router.post('/identify', uploadMiddleware.single('image'), identifyFood);

export default router;