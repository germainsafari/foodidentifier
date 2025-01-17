// utils/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

interface NutritionalContent {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  vitamins: string[];
}

export interface FoodAnalysis {
  foodName: string;
  imageUrl: string;
  countryOfOrigin: string;
  nutrition: NutritionalContent;
  description: string;
  errorMessage?: string;  // Made optional to handle error cases
}

const GEMINI_API_KEY = 'AIzaSyBWZhwhmkkR5bUaQyMOaujhQHyDYMna7uQ';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createDefaultResponse = (imageUrl: string): FoodAnalysis => ({
  foodName: "Unknown Food",
  imageUrl,
  countryOfOrigin: "Unknown",
  description: "Unable to analyze the food image at this time.",
  nutrition: {
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
    vitamins: []
  }
});

export const analyzeFoodImage = async (image: File): Promise<FoodAnalysis> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40
      }
    });

    const reader = new FileReader();

    return new Promise<FoodAnalysis>((resolve, reject) => {
      reader.onloadend = async () => {
        const base64Image = (reader.result as string);
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            if (attempt > 0) {
              await delay(RETRY_DELAY * attempt);
            }

            const prompt = `I will provide you with a food image. Please analyze it and return ONLY a JSON object with the following structure:
            {
              "foodName": "name of the dish",
              "countryOfOrigin": "country or culture of origin",
              "description": "2-3 sentence description of the dish",
              "nutrition": {
                "calories": approximate calories per serving as number,
                "proteins": protein content in grams as number,
                "carbs": carbohydrate content in grams as number,
                "fats": fat content in grams as number,
                "vitamins": ["list of main vitamins present"]
              }
            }
            Ensure all numbers are numeric values, not strings. Do not include any additional text or explanation outside the JSON object.`;

            const result = await model.generateContent({
              contents: [{ 
                role: 'user', 
                parts: [
                  { text: prompt },
                  { inlineData: { 
                    mimeType: image.type, 
                    data: base64Image.split(',')[1]
                  }}
                ]
              }],
              generationConfig: {
                maxOutputTokens: 1024,
              }
            });

            const response = await result.response;
            const text = response.text().trim();

            try {
              // Clean the response to ensure it's valid JSON
              const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
              const analysisData = JSON.parse(cleanedText);

              // Validate the response structure
              if (!analysisData.foodName || !analysisData.nutrition) {
                throw new Error('Invalid response structure');
              }

              resolve({
                ...analysisData,
                imageUrl: base64Image
              });
              return;
            } catch (parseError) {
              console.error('JSON Parse Error:', parseError, 'Raw response:', text);
              lastError = parseError;

              if (attempt === MAX_RETRIES - 1) {
                // On last attempt, try to extract what we can from the response
                const fallbackData = {
                  foodName: text.match(/"foodName":\s*"([^"]+)"/)?.[1] || "Unknown Food",
                  countryOfOrigin: text.match(/"countryOfOrigin":\s*"([^"]+)"/)?.[1] || "Unknown",
                  description: text.match(/"description":\s*"([^"]+)"/)?.[1] || "No description available",
                  nutrition: {
                    calories: parseInt(text.match(/"calories":\s*(\d+)/)?.[1] || "0"),
                    proteins: parseInt(text.match(/"proteins":\s*(\d+)/)?.[1] || "0"),
                    carbs: parseInt(text.match(/"carbs":\s*(\d+)/)?.[1] || "0"),
                    fats: parseInt(text.match(/"fats":\s*(\d+)/)?.[1] || "0"),
                    vitamins: []
                  }
                };

                resolve({
                  ...fallbackData,
                  imageUrl: base64Image,
                  errorMessage: 'Failed to parse API response'
                });
                return;
              }
              continue;
            }
          } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            lastError = error as Error;

            // Only retry on 503 errors
            if (error.toString().includes('503') === false) {
              break;
            }
          }
        }

        console.error('All attempts failed or received non-retryable error:', lastError);
        resolve({
          ...createDefaultResponse(base64Image),
          errorMessage: lastError?.message || 'Unknown error occurred'
        });
      };

      reader.onerror = (error) => {
        console.error('FileReader Error:', error);
        resolve({
          ...createDefaultResponse(""),
          errorMessage: 'Failed to read image file'
        });
      };

      reader.readAsDataURL(image);
    });
  } catch (error) {
    console.error('Analyzer Error:', error);
    return {
      ...createDefaultResponse(""),
      errorMessage: 'Failed to initialize analyzer'
    };
  }
};