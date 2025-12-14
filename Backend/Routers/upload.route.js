import { Router } from 'express';
import { uploadImage, deleteImage } from '../Controller/upload.controller.js';
import auth from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

// Upload single image - Protected route
// 'image' is the field name for the file input
router.post('/image', auth, upload.single('image'), uploadImage);

// Delete image - Protected route (optional)
router.delete('/image/:publicId', auth, deleteImage);

export default router;