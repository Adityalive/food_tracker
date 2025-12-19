import React from 'react'
import { Routes, Route } from "react-router-dom"
// REMOVED: import { initModel } from './utils/foodAI'; -> Backend handles this now!
// REMOVED: import FoodUpload -> Not used here (it's likely inside ImageUploadPage)

import Navbar from './componets/Navbar/Navbar'
import Loadingpage from './componets/Pages/Loadingpage'
import Signup from './componets/Pages/Signup'
import Register from './componets/Pages/Register'
import ImageUploadPage from './componets/Pages/Image-upload'

const App = () => {
  // REMOVED: The useEffect that loaded the model is gone.
  // The backend is now always ready to accept images.

  return (
    <Routes>
      {/* LANDING PAGE */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Loadingpage />
          </>
        }
      />

      {/* AUTH PAGES */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Register />} />
      
      {/* ⚠️ IMPORTANT: 
        Make sure your 'ImageUploadPage.js' imports and renders 
        the updated 'FoodUpload' component we just wrote! 
      */}
      <Route path='/image-upload' element={<ImageUploadPage />}/>
    </Routes>
  )
}

export default App