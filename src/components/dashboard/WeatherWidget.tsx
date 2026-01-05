import { Wind, Droplets, CloudRain, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentWeather, WeatherData } from "@/services/weatherService";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedWeatherIcon } from "./AnimatedWeatherIcon";
import { WeatherBackground } from "./WeatherBackground";
import { Card } from "@/components/ui/card";

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const data = await getCurrentWeather(
                  position.coords.latitude,
                  position.coords.longitude
                );
                setWeather(data);
              } catch (error) {
                console.error("Error fetching weather:", error);
                toast.error("Failed to load weather data");
              } finally {
                setLoading(false);
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              setLoading(false);
              toast.error("Please enable location access for weather updates");
            }
          );
        } else {
          setLoading(false);
          toast.error("Geolocation is not supported");
        }
      } catch (error) {
        console.error("Weather widget error:", error);
        setLoading(false);
      }
    };

    getWeatherData();
    // Refresh weather every 10 minutes
    const interval = setInterval(getWeatherData, 600000);
    return () => clearInterval(interval);
  }, []);

  // Use API sunrise/sunset times to determine if it's night
  const isNightTime = (weatherData: WeatherData | null): boolean => {
    if (!weatherData?.sunrise || !weatherData?.sunset) {
      // Fallback to local time if no sunrise/sunset data
      const hour = new Date().getHours();
      return hour < 6 || hour >= 18;
    }
    
    const now = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
    return now < weatherData.sunrise || now > weatherData.sunset;
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-muted-foreground mb-4">Unable to load weather data</p>
          <Button asChild variant="outline">
            <Link to="/weather">View Weather Page</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <WeatherBackground weather={weather} className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold">{t("weatherOverview")}</h2>
        <span className="text-sm opacity-80">
          {weather.cityName}, {weather.country}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
          <div className="mb-2">
            <AnimatedWeatherIcon 
              description={weather.description} 
              isNight={isNightTime(weather)} 
            />
          </div>
          <div className="text-2xl font-bold">{Math.round(weather.temperature)}°C</div>
          <div className="text-sm opacity-80">{t("temperature")}</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
          <Droplets className="h-8 w-8 mb-2" />
          <div className="text-2xl font-bold">{weather.humidity}%</div>
          <div className="text-sm opacity-80">{t("humidity")}</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
          <Wind className="h-8 w-8 mb-2" />
          <div className="text-2xl font-bold">{Math.round(weather.windSpeed)} km/h</div>
          <div className="text-sm opacity-80">{t("windSpeed")}</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
          <CloudRain className="h-8 w-8 mb-2" />
          <div className="text-2xl font-bold">{weather.precipitation || 0}%</div>
          <div className="text-sm opacity-80">{t("rainChance")}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
        <div className="text-sm opacity-80 capitalize">
          {weather.description}
        </div>
        <Button asChild variant="ghost" size="sm" className="hover:bg-white/20">
          <Link to="/weather">{t("viewFullForecast")}</Link>
        </Button>
      </div>
    </WeatherBackground>
  );
};
