"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeFoodImage } from "@/utils/gemini"; // Using alias for cleaner imports
// Updated import path

const HomePage = () => {
  const [foodName, setFoodName] = useState("");
  const [loading, setLoading] = useState(false);

  // why
  // Update in page.tsx (main page)
  // In the handleImageUpload function, update the localStorage setting:
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const data = await analyzeFoodImage(file);
        setFoodName(data.foodName);
        // Store the complete analysis data
        localStorage.setItem("foodAnalysis", JSON.stringify(data));

        // If we got a default response due to error, show an error message
        if (data.foodName === "Unknown Food") {
          setFoodName("Error: Unable to analyze image. Please try again.");
        }
      } catch (error) {
        console.error("Error analyzing image:", error);
        setFoodName("Error identifying food. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          What's on Your Plate?
        </h1>
        <p className="text-gray-600 mt-2">
          Upload an image of your food and let our AI identify it for you!
        </p>

        <div className="mt-8">
          <label
            htmlFor="upload-button"
            className="cursor-pointer inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </label>
          <input
            type="file"
            id="upload-button"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {loading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {foodName && !loading && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800">
              Detected: {foodName}
            </h2>
            <Link
              href="/results"
              className="text-indigo-600 underline mt-2 block"
            >
              See more details
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
