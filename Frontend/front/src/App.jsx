import React from 'react'
import { Routes, Route } from "react-router-dom"
import { initModel } from './utils/foodAI';

import Navbar from './componets/Navbar/Navbar'
import Loadingpage from './componets/Pages/Loadingpage'
import Signup from './componets/Pages/Signup'
import Register from './componets/Pages/Register'
import ImageUploadPage from './componets/Pages/Image-upload'
useEffect(() => {
    initModel().then(() => {
        console.log('AI ready!');
    });
}, []);
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
      <Route path="/register" element={<Register />} />
      <Route path='/image-upload' element={<ImageUploadPage />}/>
    </Routes>
  )
}

export default App
