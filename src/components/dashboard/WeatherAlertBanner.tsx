import { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle, Info, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWeatherAlerts } from "@/services/weatherService";

interface WeatherAlert {
  event: string;
  sender_name: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export const WeatherAlertBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const alertData = await getWeatherAlerts(
                  position.coords.latitude,
                  position.coords.longitude
                );
                setAlerts(alertData || []);
              } catch (error) {
                console.error("Error fetching weather alerts:", error);
                setAlerts([]);
              } finally {
                setLoading(false);
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              setLoading(false);
            }
          );
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Weather alert error:", error);
        setLoading(false);
      }
    };

    fetchAlerts();
    // Refresh alerts every 30 minutes
    const interval = setInterval(fetchAlerts, 1800000);
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = () => {
    if (currentAlertIndex < alerts.length - 1) {
      setCurrentAlertIndex(currentAlertIndex + 1);
    } else {
      setIsVisible(false);
    }
  };

  const getAlertIcon = (tags: string[]) => {
    if (tags?.some(tag => tag.toLowerCase().includes('extreme') || tag.toLowerCase().includes('severe'))) {
      return <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />;
    }
    if (tags?.some(tag => tag.toLowerCase().includes('warning'))) {
      return <AlertTriangle className="h-5 w-5 flex-shrink-0" />;
    }
    return <Info className="h-5 w-5 flex-shrink-0" />;
  };

  const getAlertBgColor = (tags: string[]) => {
    if (tags?.some(tag => tag.toLowerCase().includes('extreme') || tag.toLowerCase().includes('severe'))) {
      return "bg-destructive text-destructive-foreground";
    }
    if (tags?.some(tag => tag.toLowerCase().includes('warning'))) {
      return "bg-accent text-accent-foreground";
    }
    return "bg-primary/10 text-primary";
  };

  const formatAlertTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (loading) {
    return null; // Don't show loading state for alerts banner
  }

  if (!isVisible || alerts.length === 0) return null;

  const currentAlert = alerts[currentAlertIndex];

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${getAlertBgColor(currentAlert.tags)}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {getAlertIcon(currentAlert.tags)}
            <div className="text-sm font-medium flex-1">
              <strong>{currentAlert.event}:</strong>{" "}
              <span className="line-clamp-1">
                {currentAlert.description?.split('.')[0] || "Weather alert in your area"}
              </span>
              <span className="text-xs opacity-80 ml-2">
                (Until {formatAlertTime(currentAlert.end)})
              </span>
            </div>
            {alerts.length > 1 && (
              <span className="text-xs opacity-80">
                {currentAlertIndex + 1}/{alerts.length}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-8 w-8"
            onClick={dismissAlert}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
