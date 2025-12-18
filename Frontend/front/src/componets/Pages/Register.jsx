"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { authAPI } from "../../services/api"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await authAPI.register(formData)
      alert('Registration successful! Please login.')
      // TODO: Redirect to login page
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message)
      alert('Registration failed: ' + (error.response?.data?.message || 'Unknown error'))
    }
  }

  return (
    <div className="bg-[#2b2929] flex justify-center items-center min-h-screen">
      <form
        className="bg-[#171717] p-9 rounded-[22px] w-80 transition-all duration-500 hover:scale-[1.03]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-white text-2xl font-bold mb-6">
          Sign Up
        </h2>

        <div className="flex items-center gap-2.5 p-3 rounded-[20px] bg-[#171717] shadow-[inset_2px_5px_10px_#050505] mb-4 group">
          <UserIcon />
          <input
            name="username"
            placeholder="Username"
            className="bg-transparent border-none outline-none text-[#d3d3d3] w-full"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-[20px] bg-[#171717] shadow-[inset_2px_5px_10px_#050505] mb-4 group">
          <EmailIcon />
          <input
            name="email"
            placeholder="Email"
            className="bg-transparent border-none outline-none text-[#d3d3d3] w-full"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-[20px] bg-[#171717] shadow-[inset_2px_5px_10px_#050505] mb-4 group">
          <LockIcon />
          <input
            name="password"
            placeholder="Password"
            className="bg-transparent border-none outline-none text-[#d3d3d3] w-full"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 mt-7 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
        >
          Sign Up
        </button>

        <Link
          to="/signup"
          className="block mt-6 w-full py-2 rounded-lg bg-[#252525] text-white text-center hover:bg-[#333] transition-colors"
        >
          Already have an account? Login
        </Link>
      </form>
    </div>
  )
}

/* ---------------- ICONS ---------------- */

const UserIcon = () => (
  <svg
    className="w-5 h-5 text-cyan-400"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
  </svg>
)

const EmailIcon = () => (
  <svg
    className="w-5 h-5 text-green-400"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
  </svg>
)

const LockIcon = () => (
  <svg
    className="w-5 h-5 text-purple-400"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M8 1a3 3 0 0 1 3 3v3H5V4a3 3 0 0 1 3-3Zm4 6H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
  </svg>
)
