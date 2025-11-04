import { Card } from "@/components/ui/card";
import { CloudRain, Wind, Droplets, Sun, Cloud, CloudSnow, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentWeather, WeatherData } from "@/services/weatherService";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes("rain")) return <CloudRain className="h-8 w-8 text-primary mb-2" />;
    if (desc.includes("cloud")) return <Cloud className="h-8 w-8 text-muted-foreground mb-2" />;
    if (desc.includes("snow")) return <CloudSnow className="h-8 w-8 text-primary mb-2" />;
    return <Sun className="h-8 w-8 text-accent mb-2" />;
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
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold">Weather Overview</h2>
        <span className="text-sm text-muted-foreground">
          {weather.cityName}, {weather.country}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          {getWeatherIcon(weather.description)}
          <div className="text-2xl font-bold">{Math.round(weather.temperature)}°C</div>
          <div className="text-sm text-muted-foreground">Temperature</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Droplets className="h-8 w-8 text-primary mb-2" />
          <div className="text-2xl font-bold">{weather.humidity}%</div>
          <div className="text-sm text-muted-foreground">Humidity</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Wind className="h-8 w-8 text-secondary mb-2" />
          <div className="text-2xl font-bold">{Math.round(weather.windSpeed)} km/h</div>
          <div className="text-sm text-muted-foreground">Wind Speed</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <CloudRain className="h-8 w-8 text-primary mb-2" />
          <div className="text-2xl font-bold">{weather.precipitation || 0}%</div>
          <div className="text-sm text-muted-foreground">Rain Chance</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="text-sm text-muted-foreground capitalize">
          {weather.description}
        </div>
        <Button asChild variant="link" size="sm">
          <Link to="/weather">View Full Forecast</Link>
        </Button>
      </div>
    </Card>
  );
};
