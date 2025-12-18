"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
// Path from src/componets/Pages/Image-upload.jsx to src/componets/ui/button
import { Button } from "../ui/button";
import { uploadAPI, foodAPI, nutritionAPI } from "../../services/api";
export default function ImageUploadPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [quote, setQuote] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (file) => {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleUploadClick = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      // Step 1: Upload image to Cloudinary
      const formData = new FormData()
      formData.append('image', selectedFile)

      const uploadResponse = await uploadAPI.uploadImage(formData)
      const { data: uploadData } = uploadResponse.data

      // Step 2: Identify food from the uploaded image
      const foodResponse = await foodAPI.identifyFood(uploadData.imageUrl)
      const { data: foodData } = foodResponse.data

      if (foodData.predictions.length === 0) {
        setQuote('No food detected in the image. Please try another image.')
        return
      }

      const topFood = foodData.topPrediction.name

      // Step 3: Get nutrition information for the identified food
      const nutritionResponse = await nutritionAPI.getNutrition(topFood)
      const { data: nutritionData } = nutritionResponse.data

      // Display the results
      const nutritionInfo = nutritionData.foods[0]
      setQuote(`🍽️ **${topFood}** (100g)
• Calories: ${nutritionInfo.nf_calories} kcal
• Protein: ${nutritionInfo.nf_protein}g
• Carbs: ${nutritionInfo.nf_total_carbohydrate}g
• Fat: ${nutritionInfo.nf_total_fat}g`)

    } catch (error) {
      console.error('Process failed:', error.response?.data?.message || error.message)
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      setQuote(`Process failed: ${errorMessage}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          {/* Left side - Upload Section */}
          <div className="upload-section flex flex-col gap-6 lg:w-1/2">
            {/* Upload Image Area */}
            <div
              className={`upload-area border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center flex-1 min-h-[300px] transition-all duration-300 ${
                isDragging
                  ? "border-cyan-400 bg-cyan-400/5 scale-[1.02]"
                  : "border-gray-600 hover:border-cyan-500 hover:bg-gray-900/30"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {selectedImage ? (
                <div className="image-preview w-full h-full flex items-center justify-center">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-[350px] rounded-lg object-contain animate-fade-in"
                  />
                </div>
              ) : (
                <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-4 text-center">
                  <div className="upload-icon-wrapper p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full">
                    <Upload className="w-12 h-12 text-cyan-400" />
                  </div>
                  <div className="text-gray-300 animate-fade-in-up">
                    <p className="text-xl font-semibold mb-2">Upload Image</p>
                    <p className="text-sm text-gray-500">Drag and drop or click to select</p>
                  </div>
                  <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUploadClick}
              disabled={!selectedImage || isUploading}
              className="upload-button w-full py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>

          {/* Right side - Give Quote Section */}
          <div className="quote-section lg:w-1/2">
            <div className="quote-box border-2 border-gray-700 rounded-lg p-8 h-full min-h-[500px] bg-gradient-to-br from-gray-900/50 to-gray-800/30 flex items-center justify-center transition-all duration-500 hover:border-purple-500/50">
              {quote ? (
                <div className="quote-content animate-fade-in-scale text-center">
                  <div className="quote-icon text-6xl text-cyan-400 mb-6">&ldquo;</div>
                  <p className="text-2xl text-gray-100 font-light leading-relaxed mb-6">{quote}</p>
                  <div className="quote-decoration w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full" />
                </div>
              ) : (
                <div className="text-center text-gray-500 animate-pulse-slow">
                  <p className="text-3xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Give Quote
                  </p>
                  <p className="text-sm">Upload an image to generate a quote</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
