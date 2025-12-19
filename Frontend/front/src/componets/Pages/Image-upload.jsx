"use client"

import { useState } from "react"
// Added new icons for the nutrition list
import { Upload, Flame, Wheat, Droplets, Activity } from "lucide-react"
import { Button } from "../ui/button";
import { foodAPI } from "../../services/api";

export default function ImageUploadPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [quote, setQuote] = useState("") // Used for error messages now
  const [analysisResult, setAnalysisResult] = useState(null) // New: Stores food data
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (file) => {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result)
      // Reset previous results when new image is picked
      setAnalysisResult(null)
      setQuote("")
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
    setQuote("") // Clear any previous errors
    
    try {
      // 1. Prepare FormData
      const formData = new FormData()
      formData.append('image', selectedFile)

      // 2. Send to Backend
      const foodResponse = await foodAPI.identifyFood(formData)
      const { data: foodData } = foodResponse.data

      // 3. Validation
      if (!foodData || !foodData.foodName || foodData.foodName === "Unknown") {
         setQuote('No food detected. Please try a clearer image.')
         setAnalysisResult(null)
         return
      }

      const nutritionInfo = foodData.nutrition

      // 4. Save Structured Data (New Logic)
      setAnalysisResult({
        name: foodData.foodName,
        calories: nutritionInfo.calories,
        protein: nutritionInfo.protein,
        carbs: nutritionInfo.carbs,
        fat: nutritionInfo.fat
      })

    } catch (error) {
      console.error('Process failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      setQuote(`Process failed: ${errorMessage}`)
      setAnalysisResult(null)
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

            <Button
              onClick={handleUploadClick}
              disabled={!selectedImage || isUploading}
              className="upload-button w-full py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isUploading ? 'Analyzing...' : 'Identify Food'}
            </Button>
          </div>

          {/* Right side - Results Section (New UI) */}
          <div className="quote-section lg:w-1/2">
            <div className="quote-box relative border-2 border-gray-700 rounded-2xl p-8 h-full min-h-[500px] bg-gradient-to-br from-gray-900/80 to-black flex flex-col items-center justify-center overflow-hidden transition-all duration-500 hover:border-cyan-500/30">
              
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

              {analysisResult ? (
                <div className="w-full max-w-md animate-fade-in-up">
                  {/* Food Header */}
                  <div className="text-center mb-10">
                    <div className="inline-block p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-900/20">
                       <span className="text-4xl">🍽️</span>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent capitalize">
                      {analysisResult.name}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2 font-medium tracking-widest uppercase">Per 100g Serving</p>
                  </div>

                  {/* Nutrition List */}
                  <div className="space-y-4">
                    {/* Calories Item */}
                    <div className="group flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] hover:border-orange-500/30">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-400 group-hover:text-orange-300 transition-colors">
                          <Flame size={24} />
                        </div>
                        <span className="text-gray-300 font-medium">Calories</span>
                      </div>
                      <span className="text-xl font-bold text-white font-mono">{analysisResult.calories} <span className="text-sm text-gray-500 font-sans">kcal</span></span>
                    </div>

                    {/* Protein Item */}
                    <div className="group flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] delay-75 hover:border-blue-500/30">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                          <Activity size={24} />
                        </div>
                        <span className="text-gray-300 font-medium">Protein</span>
                      </div>
                      <span className="text-xl font-bold text-white font-mono">{analysisResult.protein} <span className="text-sm text-gray-500 font-sans">g</span></span>
                    </div>

                    {/* Carbs Item */}
                    <div className="group flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] delay-100 hover:border-yellow-500/30">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-yellow-500/10 rounded-lg text-yellow-400 group-hover:text-yellow-300 transition-colors">
                          <Wheat size={24} />
                        </div>
                        <span className="text-gray-300 font-medium">Carbs</span>
                      </div>
                      <span className="text-xl font-bold text-white font-mono">{analysisResult.carbs} <span className="text-sm text-gray-500 font-sans">g</span></span>
                    </div>

                    {/* Fat Item */}
                    <div className="group flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] delay-150 hover:border-pink-500/30">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-pink-500/10 rounded-lg text-pink-400 group-hover:text-pink-300 transition-colors">
                          <Droplets size={24} />
                        </div>
                        <span className="text-gray-300 font-medium">Fats</span>
                      </div>
                      <span className="text-xl font-bold text-white font-mono">{analysisResult.fat} <span className="text-sm text-gray-500 font-sans">g</span></span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty / Error State */
                <div className="text-center text-gray-500 animate-in fade-in zoom-in duration-500">
                  {quote ? (
                     <div className="max-w-xs mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                       <p className="text-red-400 mb-2 font-semibold">⚠️ Alert</p>
                       <p className="text-gray-300">{quote}</p>
                     </div>
                  ) : (
                    <>
                      <div className="mb-6 relative inline-block">
                        <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative p-6 bg-gray-800 rounded-full border border-gray-700">
                          <Activity className="w-12 h-12 text-gray-600" />
                        </div>
                      </div>
                      <p className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        Food Analyzer
                      </p>
                      <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
                        Upload an image to identify food <br/>and get detailed nutritional breakdown
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}