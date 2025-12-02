import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const validateCoordinates = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

const validateQuery = (query: string): boolean => {
  return query.length > 0 && query.length <= 200;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, type = 'current', query } = await req.json();
    const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

    if (!OPENWEATHER_API_KEY) {
      throw new Error('OPENWEATHER_API_KEY not configured');
    }

    // Handle geocoding requests (forward and reverse)
    if (type === 'geocode') {
      if (!query || !validateQuery(query)) {
        throw new Error('Query parameter is required and must be between 1-200 characters');
      }
      
      console.log('Geocoding request for:', query);
      
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`;
      console.log('Fetching from:', geocodeUrl.replace(OPENWEATHER_API_KEY, 'API_KEY'));
      
      const response = await fetch(geocodeUrl);
      
      if (!response.ok) {
        console.error('Geocoding API error:', response.status, response.statusText);
        throw new Error(`Geocoding API returned ${response.status}: ${response.statusText}`);
      }
      
      const geocodeData = await response.json();
      console.log('Geocoding results found:', geocodeData.length);
      
      return new Response(JSON.stringify(geocodeData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle reverse geocoding (coordinates to location name)
    if (type === 'reverse') {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required for reverse geocoding');
      }
      
      if (!validateCoordinates(latitude, longitude)) {
        throw new Error('Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180');
      }
      
      console.log('Reverse geocoding for:', latitude, longitude);
      
      const reverseUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`;
      
      const response = await fetch(reverseUrl);
      
      if (!response.ok) {
        console.error('Reverse geocoding API error:', response.status, response.statusText);
        throw new Error(`Reverse geocoding API returned ${response.status}: ${response.statusText}`);
      }
      
      const reverseData = await response.json();
      console.log('Reverse geocoding result:', reverseData);
      
      return new Response(JSON.stringify(reverseData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

    if (!validateCoordinates(latitude, longitude)) {
      throw new Error('Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180');
    }

    let weatherData;

    if (type === 'current') {
      // Get current weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      weatherData = await response.json();
    } else if (type === 'forecast') {
      // Get 7-day forecast
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      weatherData = await response.json();
    } else if (type === 'alerts') {
      // Get weather alerts using One Call API
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      weatherData = await response.json();
    }

    console.log('Weather data fetched successfully:', type);

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in weather function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: error instanceof Error && error.message.startsWith('Unauthorized') ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
