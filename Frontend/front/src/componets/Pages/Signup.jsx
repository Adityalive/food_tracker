"use client"

import React, { useState } from "react"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login data:", formData)
    // TODO: API call
  }

  return (
    <div className="bg-[#2b2929] flex justify-center items-center min-h-screen">
      <form
        className="bg-[#171717] p-9 rounded-[22px] w-80 transition-all duration-500 hover:scale-[1.03]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-white text-2xl font-bold mb-6">
          Login
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

        <div className="flex gap-2.5 mt-7">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold"
          >
            Login
          </button>

          <button
            type="button"
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
          >
            Sign Up
          </button>
        </div>

        <button
          type="button"
          className="mt-6 w-full py-2 rounded-lg bg-[#252525] text-white"
        >
          Forgot Password?
        </button>
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

const LockIcon = () => (
  <svg
    className="w-5 h-5 text-purple-400"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M8 1a3 3 0 0 1 3 3v3H5V4a3 3 0 0 1 3-3Zm4 6H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
  </svg>
)
