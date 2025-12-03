import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentWeather, getWeatherForecast, getWeatherAlerts, type WeatherData, type ForecastData } from "@/services/weatherService";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationSuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Eye,
  MapPin,
  Settings,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("rain")) return CloudRain;
  if (desc.includes("cloud")) return Cloud;
  if (desc.includes("snow")) return CloudSnow;
  return Sun;
};

const Weather = () => {
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState({
    rain: true,
    temperature: true,
    wind: false,
    frost: true,
  });
  const { toast } = useToast();
  const { t } = useLanguage();

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsFetchingSuggestions(true);
    try {
      // Append ",IN" to search only Indian cities
      const { data, error } = await supabase.functions.invoke("weather", {
        body: { type: "geocode", query: `${query.trim()},IN` },
      });

      if (!error && data && Array.isArray(data)) {
        // Filter to only show Indian cities
        const indianCities = data
          .filter((item: any) => item.country === "IN")
          .slice(0, 5)
          .map((item: any) => ({
            name: item.name,
            state: item.state,
            country: item.country,
            lat: item.lat,
            lon: item.lon,
          }));
        setSuggestions(indianCities);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  const handleInputChange = (value: string) => {
    setLocationInput(value);
    setShowSuggestions(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    setCoordinates({ lat: suggestion.lat, lon: suggestion.lon });
    const locationName = `${suggestion.name}${suggestion.state ? ', ' + suggestion.state : ''}, ${suggestion.country}`;
    setLocation(locationName);
    setLocationInput("");
    setSuggestions([]);
    setShowSuggestions(false);
    
    toast({
      title: t("locationUpdated"),
      description: `${t("nowShowingWeatherFor")} ${locationName}`,
    });
  };

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast({
        title: t("error"),
        description: t("pleaseEnterLocation"),
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      console.log("Searching for location:", searchQuery);
      
      const { data, error } = await supabase.functions.invoke("weather", {
        body: { type: "geocode", query: searchQuery.trim() },
      });
      
      console.log("Geocode response:", { data, error });
      
      if (error) {
        console.error("Geocode error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        toast({
          title: t("notFound"),
          description: t("locationNotFound"),
          variant: "destructive",
        });
        return;
      }

      const result = data[0];
      setCoordinates({ lat: result.lat, lon: result.lon });
      setLocation(`${result.name}, ${result.country}`);
      setLocationInput("");
      
      toast({
        title: t("locationUpdated"),
        description: `${t("nowShowingWeatherFor")} ${result.name}, ${result.country}`,
      });
    } catch (error) {
      console.error("Error searching location:", error);
      toast({
        title: t("searchFailed"),
        description: error instanceof Error ? error.message : t("failedToSearch"),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const fetchWeatherData = async () => {
    if (!coordinates) return;
    
    setIsLoading(true);
    try {
      const [weather, forecastData, alertsData] = await Promise.all([
        getCurrentWeather(coordinates.lat, coordinates.lon),
        getWeatherForecast(coordinates.lat, coordinates.lon),
        getWeatherAlerts(coordinates.lat, coordinates.lon),
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
      setAlerts(alertsData || []);
      
      // Don't override location if we already have a proper location set
      // (Weather API sometimes returns incorrect location names)
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t("error"),
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setLocation(t("detectingLocation"));
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setCoordinates({ lat, lon });
        setLocation(t("fetchingLocationName"));
        
        // Get proper location name using reverse geocoding
        try {
          const { data, error } = await supabase.functions.invoke("weather", {
            body: { type: "reverse", latitude: lat, longitude: lon },
          });
          
          if (!error && data && data.length > 0) {
            const locationName = `${data[0].name}${data[0].state ? ', ' + data[0].state : ''}, ${data[0].country}`;
            setLocation(locationName);
            toast({
              title: t("locationFound"),
              description: `${t("loadingWeatherFor")} ${locationName}`,
            });
          } else {
            setLocation(t("yourLocation"));
          }
        } catch (error) {
          console.error("Error getting location name:", error);
          setLocation(t("yourLocation"));
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: t("locationAccessDenied"),
          description: t("usingDefaultLocation"),
          variant: "destructive",
        });
        setLocation("Pune, Maharashtra, IN");
        setCoordinates({ lat: 18.5204, lon: 73.8567 });
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (coordinates) {
      fetchWeatherData();
    }
  }, [coordinates]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">{t("weatherAlerts")}</h1>
            <p className="text-muted-foreground">
              {t("weatherDescription")}
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                {t("settings")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("weatherSettings")}</DialogTitle>
                <DialogDescription>
                  {t("manageLocationAndNotifications")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="location">{t("currentLocation")}</Label>
                  <div className="flex gap-2 mb-4">
                    <Input
                      id="current-location"
                      value={location || t("fetchingLocation")}
                      disabled
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={getUserLocation} title={t("currentLocation")}>
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Label htmlFor="search-location">{t("searchLocation")}</Label>
                  <div className="relative" ref={searchContainerRef}>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="search-location"
                          placeholder={t("enterCityName")}
                          value={locationInput}
                          onChange={(e) => handleInputChange(e.target.value)}
                          onFocus={() => setShowSuggestions(true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && suggestions.length > 0) {
                              selectSuggestion(suggestions[0]);
                            } else if (e.key === 'Escape') {
                              setShowSuggestions(false);
                            }
                          }}
                          className="w-full"
                          autoComplete="off"
                        />
                        {showSuggestions && (locationInput.length >= 2 || suggestions.length > 0) && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden">
                            {isFetchingSuggestions ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="ml-2 text-sm text-muted-foreground">{t("searching")}</span>
                              </div>
                            ) : suggestions.length > 0 ? (
                              <ul className="py-1">
                                {suggestions.map((suggestion, index) => (
                                  <li
                                    key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                                    className="px-3 py-2 hover:bg-accent cursor-pointer text-sm flex items-center gap-2"
                                    onClick={() => selectSuggestion(suggestion)}
                                  >
                                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span>
                                      {suggestion.name}
                                      {suggestion.state && <span className="text-muted-foreground">, {suggestion.state}</span>}
                                      <span className="text-muted-foreground">, {suggestion.country}</span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : locationInput.length >= 2 ? (
                              <div className="py-4 text-center text-sm text-muted-foreground">
                                {t("noCitiesFound")}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                      <Button 
                        onClick={() => {
                          if (suggestions.length > 0) {
                            selectSuggestion(suggestions[0]);
                          } else {
                            searchLocation(locationInput);
                          }
                        }}
                        disabled={isSearching}
                      >
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : t("search")}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("startTypingForSuggestions")}
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>{t("alertNotifications")}</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rain" className="cursor-pointer">{t("rainAlerts")}</Label>
                      <Switch
                        id="rain"
                        checked={notifications.rain}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, rain: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temp" className="cursor-pointer">{t("temperatureAlerts")}</Label>
                      <Switch
                        id="temp"
                        checked={notifications.temperature}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, temperature: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wind" className="cursor-pointer">{t("windAlerts")}</Label>
                      <Switch
                        id="wind"
                        checked={notifications.wind}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, wind: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="frost" className="cursor-pointer">{t("frostAlerts")}</Label>
                      <Switch
                        id="frost"
                        checked={notifications.frost}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, frost: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Alerts */}
        <Card className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4">{t("activeWeatherAlerts")}</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 border-l-4 rounded-lg ${alert.severity === "High" || alert.severity === "severe" ? "border-l-destructive bg-destructive/5" : "border-l-accent bg-accent/5"}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${alert.severity === "High" || alert.severity === "severe" ? "text-destructive" : "text-accent"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold">{alert.event || alert.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${alert.severity === "High" || alert.severity === "severe" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      {alert.start && alert.end && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Valid from {new Date(alert.start * 1000).toLocaleString()} to {new Date(alert.end * 1000).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">{t("noActiveAlerts")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("willNotifyWhenChange")}</p>
            </div>
          )}
        </Card>

        {/* Current Weather */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">{location || t("fetchingLocation")}</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : currentWeather ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-6">
                {(() => {
                  const WeatherIcon = getWeatherIcon(currentWeather.description);
                  return <WeatherIcon className="h-24 w-24 text-accent" />;
                })()}
                <div>
                  <div className="text-6xl font-bold mb-2">{Math.round(currentWeather.temperature)}°C</div>
                  <div className="text-lg text-muted-foreground capitalize">{currentWeather.description}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <Droplets className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
                  <div className="text-sm text-muted-foreground">{t("humidity")}</div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <Wind className="h-8 w-8 text-secondary mb-2" />
                  <div className="text-2xl font-bold">{Math.round(currentWeather.windSpeed)} km/h</div>
                  <div className="text-sm text-muted-foreground">{t("windSpeed")}</div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <CloudRain className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">{currentWeather.precipitation}%</div>
                  <div className="text-sm text-muted-foreground">{t("precipitation")}</div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <Eye className="h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-2xl font-bold">{(currentWeather.windSpeed / 10).toFixed(1)} km</div>
                  <div className="text-sm text-muted-foreground">{t("visibility")}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t("failedToLoadWeather")}
            </div>
          )}
        </Card>

        {/* 7-Day Forecast */}
        <Card className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4">{t("sevenDayForecast")}</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : forecast.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {forecast.map((day, index) => {
                const WeatherIcon = getWeatherIcon(day.description);
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="font-medium mb-2">{dayName}</div>
                    <WeatherIcon className="h-10 w-10 text-primary mb-2" />
                    <div className="text-sm text-muted-foreground mb-1 capitalize">{day.description}</div>
                    <div className="flex gap-2 text-sm">
                      <span className="font-semibold">{Math.round(day.temperature.max)}°</span>
                      <span className="text-muted-foreground">{Math.round(day.temperature.min)}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t("failedToLoadWeather")}
            </div>
          )}
        </Card>

        {/* Agricultural Impact */}
        <Card className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4">{t("agriculturalImpact")}</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <div className="font-medium mb-1">{t("generalRecommendations")}</div>
                <p className="text-sm text-muted-foreground">
                  {t("monitorSoilMoisture")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("planIrrigationBased")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("protectCropsFromExtreme")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("checkPestActivity")}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Weather;
