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

  // Transform the API response to our WeatherData format
  return {
    temperature: data.main.temp,
    humidity: data.main.humidity,
    precipitation: data.clouds?.all || 0,
    windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  };
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

  // Group forecast by day and get min/max temps
  const dailyForecasts: { [key: string]: ForecastData } = {};
  
  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        temperature: {
          min: item.main.temp_min,
          max: item.main.temp_max,
        },
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      };
    } else {
      dailyForecasts[date].temperature.min = Math.min(
        dailyForecasts[date].temperature.min,
        item.main.temp_min
      );
      dailyForecasts[date].temperature.max = Math.max(
        dailyForecasts[date].temperature.max,
        item.main.temp_max
      );
    }
  });

  return Object.values(dailyForecasts).slice(0, 7);
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
