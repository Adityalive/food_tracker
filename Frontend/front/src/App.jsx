import React from 'react'
import { Routes, Route } from "react-router-dom"

import Navbar from './componets/Navbar/Navbar'
import Loadingpage from './componets/Pages/Loadingpage'
import Signup from './componets/Pages/Signup'
import ImageUploadPage from './componets/Pages/Image-upload'
const App = () => {
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

      {/* SIGNUP PAGE */}
      <Route path="/signup" element={<Signup />} />
      <Route path='/image-upload' element={<ImageUploadPage />}/>
    </Routes>
  )
}

export default App
