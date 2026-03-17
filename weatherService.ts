import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
  alerts: string[];
  recommendations: {
    outdoor: string[];
    indoor: string[];
    food: string[];
  };
  bestTime: string;
}

async function fetchOpenWeatherData(city: string) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
  );
  if (!response.ok) {
    throw new Error("City not found");
  }
  return response.json();
}

export async function getTravelPlan(city: string): Promise<WeatherData> {
  // 1. Fetch real weather data from OpenWeather
  const weather = await fetchOpenWeatherData(city);
  
  // 2. Use Gemini to generate recommendations based on this real data
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `The current weather in ${city} is:
    - Temperature: ${weather.main.temp}°C
    - Condition: ${weather.weather[0].main} (${weather.weather[0].description})
    - Humidity: ${weather.main.humidity}%
    - Wind Speed: ${weather.wind.speed} m/s
    
    Based on this REAL weather data, provide a detailed travel report.
    Include:
    1. A brief 3-day forecast summary (predict based on current trends).
    2. Any extreme weather alerts if applicable.
    3. 3 specific outdoor activity suggestions for current weather.
    4. 3 specific indoor activity suggestions for current weather.
    5. 3 food/cafe recommendations.
    6. The best time of day to explore based on today's weather.
    
    Return the data in a structured JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          forecast: { type: "string" },
          alerts: { type: "array", items: { type: "string" } },
          recommendations: {
            type: "object",
            properties: {
              outdoor: { type: "array", items: { type: "string" } },
              indoor: { type: "array", items: { type: "string" } },
              food: { type: "array", items: { type: "string" } },
            },
            required: ["outdoor", "indoor", "food"],
          },
          bestTime: { type: "string" },
        },
        required: ["forecast", "alerts", "recommendations", "bestTime"],
      },
    },
  });

  try {
    const aiData = JSON.parse(response.text || "{}");
    return {
      city: weather.name,
      temperature: weather.main.temp,
      condition: weather.weather[0].main,
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed * 3.6, // convert m/s to km/h
      forecast: aiData.forecast,
      alerts: aiData.alerts,
      recommendations: aiData.recommendations,
      bestTime: aiData.bestTime,
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Could not fetch travel plan. Please try again.");
  }
}

export interface PlannerTrip {
  destination: string;
  dates: string;
  type: string;
  weatherForecast: string;
  itinerary: {
    day: number;
    activities: string[];
    weatherNote: string;
  }[];
  packingList: string[];
}

export async function getPlannerTrip(destination: string, dates: string, type: string): Promise<PlannerTrip> {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Plan a ${type} trip to ${destination} for the dates ${dates}. 
    Analyze the typical weather for these dates and provide:
    1. A summary of the expected weather forecast.
    2. A 3-day itinerary with activities tailored to both the ${type} theme and the expected weather.
    3. A specific packing list based on the weather.
    
    Return the data in a structured JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          destination: { type: "string" },
          dates: { type: "string" },
          type: { type: "string" },
          weatherForecast: { type: "string" },
          itinerary: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "number" },
                activities: { type: "array", items: { type: "string" } },
                weatherNote: { type: "string" },
              },
              required: ["day", "activities", "weatherNote"],
            },
          },
          packingList: { type: "array", items: { type: "string" } },
        },
        required: ["destination", "dates", "type", "weatherForecast", "itinerary", "packingList"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as PlannerTrip;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Could not generate trip plan. Please try again.");
  }
}
