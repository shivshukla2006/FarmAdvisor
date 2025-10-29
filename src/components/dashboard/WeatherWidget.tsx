import { Card } from "@/components/ui/card";
import { CloudRain, Wind, Droplets, Sun } from "lucide-react";

export const WeatherWidget = () => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold">Weather Overview</h2>
        <span className="text-sm text-muted-foreground">Pune, Maharashtra</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Sun className="h-8 w-8 text-accent mb-2" />
          <div className="text-2xl font-bold">28°C</div>
          <div className="text-sm text-muted-foreground">Temperature</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Droplets className="h-8 w-8 text-primary mb-2" />
          <div className="text-2xl font-bold">65%</div>
          <div className="text-sm text-muted-foreground">Humidity</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Wind className="h-8 w-8 text-secondary mb-2" />
          <div className="text-2xl font-bold">12 km/h</div>
          <div className="text-sm text-muted-foreground">Wind Speed</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <CloudRain className="h-8 w-8 text-primary mb-2" />
          <div className="text-2xl font-bold">40%</div>
          <div className="text-sm text-muted-foreground">Rain Chance</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          7-Day Forecast: Partly cloudy with chances of rain on Wednesday
        </div>
      </div>
    </Card>
  );
};
