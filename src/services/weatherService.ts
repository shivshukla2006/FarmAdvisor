import { supabase } from "@/integrations/supabase/client";

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export interface ForecastData {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
}

export const getCurrentWeather = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  const { data, error } = await supabase.functions.invoke("weather", {
    body: { latitude, longitude, type: "current" },
  });

  if (error) {
    console.error("Error fetching weather:", error);
    throw new Error("Failed to fetch weather data. Please try again.");
  }

  return data;
};

export const getWeatherForecast = async (
  latitude: number,
  longitude: number
): Promise<ForecastData[]> => {
  const { data, error } = await supabase.functions.invoke("weather", {
    body: { latitude, longitude, type: "forecast" },
  });

  if (error) {
    console.error("Error fetching forecast:", error);
    throw new Error("Failed to fetch weather forecast. Please try again.");
  }

  return data.forecast || [];
};

export const getWeatherAlerts = async (
  latitude: number,
  longitude: number
): Promise<any[]> => {
  const { data, error } = await supabase.functions.invoke("weather", {
    body: { latitude, longitude, type: "alerts" },
  });

  if (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }

  return data.alerts || [];
};
