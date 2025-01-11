// app/results/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { FoodAnalysis } from '@/utils/gemini';

const ResultsPage = () => {
  const [foodData, setFoodData] = useState<FoodAnalysis | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('foodAnalysis');
    if (storedData) {
      setFoodData(JSON.parse(storedData));
    }
  }, []);

  if (!foodData) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>No food analysis data found.</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 bg-indigo-500 text-white rounded-lg">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">Food Analysis Results</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src={foodData.imageUrl} 
              alt={foodData.foodName}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-800">{foodData.foodName}</h2>
              <p className="text-gray-600 mt-2">{foodData.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800">Country of Origin</h3>
              <p className="text-gray-600">{foodData.countryOfOrigin}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800">Nutritional Content</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white p-2 rounded">
                  <p className="font-medium">Calories</p>
                  <p className="text-gray-600">{foodData.nutrition.calories} kcal</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p className="font-medium">Proteins</p>
                  <p className="text-gray-600">{foodData.nutrition.proteins}g</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p className="font-medium">Carbs</p>
                  <p className="text-gray-600">{foodData.nutrition.carbs}g</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p className="font-medium">Fats</p>
                  <p className="text-gray-600">{foodData.nutrition.fats}g</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium">Key Vitamins</p>
                <p className="text-gray-600">{foodData.nutrition.vitamins.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Analyze Another Food
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ResultsPage;
