import React from "react";

const HeroContent = () => {
  return (
    <div className="max-w-xl text-white">
      <h1 className="text-5xl font-bold leading-tight">
        Track Calories.
        <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Detect Food Instantly.
        </span>
      </h1>

      <p className="mt-6 text-gray-400 text-lg">
        AI-powered food detection that analyzes your meals and
        gives accurate calorie insights in seconds.
      </p>

      <div className="mt-8 flex gap-6">
        <button className="px-6 py-3 rounded-xl bg-emerald-400 text-black font-medium shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/70 transition">
          Start Tracking
        </button>

        <button className="px-6 py-3 rounded-xl border border-gray-600 hover:border-emerald-400 hover:text-emerald-400 transition">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default HeroContent;
