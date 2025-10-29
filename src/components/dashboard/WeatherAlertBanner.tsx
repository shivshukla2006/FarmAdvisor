import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WeatherAlertBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const hasAlert = true; // This would be dynamic based on actual weather data

  if (!isVisible || !hasAlert) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm font-medium">
              <strong>Weather Alert:</strong> Heavy rainfall expected in your region within the next 24 hours. 
              Secure your crops and equipment.
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-8 w-8"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
