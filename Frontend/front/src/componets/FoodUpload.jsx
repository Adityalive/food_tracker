import React, { useState } from 'react';
import axios from 'axios';

function FoodUpload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState('');

    // 1. Handle Image Selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setSelectedImage(file);
        setScanResult(null); // Reset previous results
        setError('');

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    // 2. Send to Backend (Replaces your old handleAnalyze & uploadToCloudinary)
    const handleAnalyze = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        setError('');

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            // ⚠️ CHECK PORT: Ensure this matches your Backend port (usually 5000)
            // Your previous code had 3000, which is usually React. 
            const API_URL = 'http://localhost:5000/api/food/identify'; 

            const token = localStorage.getItem('token'); 

            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (response.data.success) {
                setScanResult(response.data.data);
            }

        } catch (err) {
            console.error("Analysis Error:", err);
            setError(err.response?.data?.message || 'Failed to analyze food. Try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 3. Save to Daily Log
    const handleSave = async () => {
        if (!scanResult) return;

        try {
            const token = localStorage.getItem('token');
            const logData = {
                foodName: scanResult.foodName,
                imageUrl: scanResult.imageUrl,
                portionSize: "1 serving",
                calories: scanResult.nutrition.calories,
                protein: scanResult.nutrition.protein,
                carbohydrates: scanResult.nutrition.carbs,
                fat: scanResult.nutrition.fat,
                fiber: scanResult.nutrition.fiber || 0,
                sugar: scanResult.nutrition.sugar || 0,
                confidence: scanResult.confidence
            };

            await axios.post('http://localhost:5000/api/foodlog', logData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('✅ Food saved to your log!');
            // Reset UI
            setSelectedImage(null);
            setImagePreview(null);
            setScanResult(null);

        } catch (err) {
            console.error(err);
            alert('Failed to save entry');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>📸 AI Food Scanner</h2>

            {/* Image Input */}
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'block', marginBottom: '10px' }}
                />
            </div>

            {/* Preview Area */}
            {imagePreview && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    
                    {!scanResult && (
                        <button 
                            onClick={handleAnalyze} 
                            disabled={isAnalyzing}
                            style={{
                                display: 'block',
                                width: '100%',
                                marginTop: '15px',
                                padding: '12px',
                                backgroundColor: isAnalyzing ? '#ccc' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '16px',
                                cursor: isAnalyzing ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isAnalyzing ? '🔍 Analyzing...' : '🚀 Identify Food'}
                        </button>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {/* Results Display */}
            {scanResult && (
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
                    <h3>🍽️ Found: <span style={{ color: '#2196F3' }}>{scanResult.foodName}</span></h3>
                    <p style={{ color: '#666', fontSize: '0.9em' }}>
                        Confidence: {(scanResult.confidence * 100).toFixed(1)}%
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '15px 0' }}>
                        <StatBox label="Calories" value={scanResult.nutrition.calories} unit="kcal" />
                        <StatBox label="Protein" value={scanResult.nutrition.protein} unit="g" />
                        <StatBox label="Carbs" value={scanResult.nutrition.carbs} unit="g" />
                        <StatBox label="Fat" value={scanResult.nutrition.fat} unit="g" />
                    </div>

                    <button
                        onClick={handleSave}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        💾 Save to Daily Log
                    </button>
                </div>
            )}
        </div>
    );
}

// Simple helper component for the stats
const StatBox = ({ label, value, unit }) => (
    <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '0.8em', color: '#888' }}>{label}</div>
        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{value || 0}{unit}</div>
    </div>
);

export default FoodUpload;