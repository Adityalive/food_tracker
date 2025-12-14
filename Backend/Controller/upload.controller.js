import cloudinary from '../config/cloudinary.js';

// Upload image to Cloudinary
export const uploadImage = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'No file uploaded. Please select an image.' 
            });
        }

        // Convert buffer to base64
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder: 'calorie-counter', // Organize images in a folder
            resource_type: 'image',
            transformation: [
                { width: 800, height: 800, crop: 'limit' }, // Resize if larger than 800x800
                { quality: 'auto' }, // Auto optimize quality
                { fetch_format: 'auto' } // Auto format (WebP when supported)
            ]
        });

        // Return success response with image URL
        return res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                imageUrl: uploadResponse.secure_url,
                publicId: uploadResponse.public_id,
                width: uploadResponse.width,
                height: uploadResponse.height,
                format: uploadResponse.format
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
};

// Delete image from Cloudinary (optional - for cleanup)
export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required'
            });
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            return res.status(200).json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Image not found or already deleted'
            });
        }

    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete image',
            error: error.message
        });
    }
};