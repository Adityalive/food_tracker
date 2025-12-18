import React, { useState, useRef, useEffect } from 'react';
import { analyzeFood } from '../utils/foodAI';

function FoodUpload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedFood, setSelectedFood] = useState('');
    const [manualSearch, setManualSearch] = useState('');
    
    const imgRef = useRef(null);

    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setSelectedImage(file);
        setPredictions([]); // Reset predictions
        setSelectedFood('');

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Analyze image with AI
    const handleAnalyze = async () => {
        if (!imgRef.current) return;

        setIsAnalyzing(true);
        setPredictions([]);

        try {
            const results = await analyzeFood(imgRef.current);
            setPredictions(results);
            
            // Auto-select top prediction
            if (results.length > 0) {
                setSelectedFood(results[0].name);
            }
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('AI analysis failed. Please search manually below.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Upload image to your backend (Cloudinary)
    const uploadToCloudinary = async () => {
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await fetch('http://localhost:3000/api/upload/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                return data.data.imageUrl;
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    // Continue with selected/searched food
    const handleContinue = async () => {
        const foodToSearch = selectedFood || manualSearch;
        
        if (!foodToSearch) {
            alert('Please select a food or search manually');
            return;
        }

        // 1. Upload image to Cloudinary
        const imageUrl = await uploadToCloudinary();

        // 2. Search USDA for nutrition
        // 3. Show results
        // ... (your existing flow)
        
        console.log('Searching for:', foodToSearch);
        console.log('Image URL:', imageUrl);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Upload Food Image</h2>

            {/* Image Upload */}
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'block', marginBottom: '10px' }}
                />
            </div>

            {/* Image Preview */}
            {imagePreview && (
                <div style={{ marginBottom: '20px' }}>
                    <img 
                        ref={imgRef}
                        src={imagePreview}
                        alt="Food preview"
                        crossOrigin="anonymous"
                        onLoad={() => console.log('Image loaded, ready for AI')}
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '400px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    />

                    <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        style={{
                            marginTop: '10px',
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isAnalyzing ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isAnalyzing ? '🔍 Analyzing...' : '🤖 Identify with AI'}
                    </button>
                </div>
            )}

            {/* AI Predictions */}
            {predictions.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>AI Suggestions:</h3>
                    <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
                        {predictions.map((pred, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <input 
                                        type="radio"
                                        name="foodChoice"
                                        value={pred.name}
                                        checked={selectedFood === pred.name}
                                        onChange={(e) => setSelectedFood(e.target.value)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <span>
                                        <strong>{pred.name}</strong>
                                        {' '}({Math.round(pred.confidence * 100)}% confident)
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Manual Search */}
            {imagePreview && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>Or Search Manually:</h3>
                    <input 
                        type="text"
                        placeholder="Type food name (e.g., banana, pizza)..."
                        value={manualSearch}
                        onChange={(e) => {
                            setManualSearch(e.target.value);
                            setSelectedFood(''); // Deselect AI predictions
                        }}
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }}
                    />
                </div>
            )}

            {/* Continue Button */}
            {(selectedFood || manualSearch) && (
                <button
                    onClick={handleContinue}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Continue with "{selectedFood || manualSearch}"
                </button>
            )}
        </div>
    );
}

export default FoodUpload;