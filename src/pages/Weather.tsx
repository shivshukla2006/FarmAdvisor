import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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

const forecastData = [
  { day: "Mon", high: 32, low: 24, condition: "Sunny", icon: Sun },
  { day: "Tue", high: 30, low: 23, condition: "Cloudy", icon: Cloud },
  { day: "Wed", high: 28, low: 22, condition: "Rainy", icon: CloudRain },
  { day: "Thu", high: 27, low: 21, condition: "Rainy", icon: CloudRain },
  { day: "Fri", high: 29, low: 22, condition: "Cloudy", icon: Cloud },
  { day: "Sat", high: 31, low: 24, condition: "Sunny", icon: Sun },
  { day: "Sun", high: 33, low: 25, condition: "Sunny", icon: Sun },
];

const alerts = [
  {
    type: "warning",
    title: "Heavy Rainfall Alert",
    description: "Heavy rainfall expected in your region. Secure crops and equipment.",
    severity: "High",
  },
  {
    type: "info",
    title: "Temperature Advisory",
    description: "Temperatures may drop below 20°C. Protect sensitive crops.",
    severity: "Medium",
  },
];

const Weather = () => {
  const [location, setLocation] = useState("Pune, Maharashtra");
  const [notifications, setNotifications] = useState({
    rain: true,
    temperature: true,
    wind: false,
    frost: true,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Weather Alerts</h1>
            <p className="text-muted-foreground">
              Real-time weather updates and agricultural alerts for your region
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Weather Settings</DialogTitle>
                <DialogDescription>
                  Manage your location and notification preferences
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Alert Notifications</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rain" className="cursor-pointer">Rain Alerts</Label>
                      <Switch
                        id="rain"
                        checked={notifications.rain}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, rain: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temp" className="cursor-pointer">Temperature Alerts</Label>
                      <Switch
                        id="temp"
                        checked={notifications.temperature}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, temperature: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wind" className="cursor-pointer">Wind Alerts</Label>
                      <Switch
                        id="wind"
                        checked={notifications.wind}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, wind: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="frost" className="cursor-pointer">Frost Alerts</Label>
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
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <Card key={index} className={`p-4 border-l-4 ${alert.severity === "High" ? "border-l-destructive" : "border-l-accent"}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${alert.severity === "High" ? "text-destructive" : "text-accent"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold">{alert.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${alert.severity === "High" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Current Weather */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">{location}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-6">
              <Sun className="h-24 w-24 text-accent" />
              <div>
                <div className="text-6xl font-bold mb-2">28°C</div>
                <div className="text-lg text-muted-foreground">Sunny</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>High: 32°C</span>
                  <TrendingDown className="h-4 w-4 ml-2" />
                  <span>Low: 24°C</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <Eye className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="text-2xl font-bold">10 km</div>
                <div className="text-sm text-muted-foreground">Visibility</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 7-Day Forecast */}
        <Card className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4">7-Day Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {forecastData.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="font-medium mb-2">{day.day}</div>
                <day.icon className="h-10 w-10 text-primary mb-2" />
                <div className="text-sm text-muted-foreground mb-1">{day.condition}</div>
                <div className="flex gap-2 text-sm">
                  <span className="font-semibold">{day.high}°</span>
                  <span className="text-muted-foreground">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Agricultural Impact */}
        <Card className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4">Agricultural Impact Analysis</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <div className="font-medium mb-1">Irrigation Recommendation</div>
                <p className="text-sm text-muted-foreground">
                  With 40% chance of rain, consider delaying irrigation for 2-3 days to conserve water.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <div className="font-medium mb-1">Crop Protection</div>
                <p className="text-sm text-muted-foreground">
                  High humidity levels may increase fungal disease risk. Monitor crops closely and ensure proper ventilation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <div className="font-medium mb-1">Field Operations</div>
                <p className="text-sm text-muted-foreground">
                  Weather conditions are favorable for field work today and tomorrow. Plan accordingly for planting or harvesting activities.
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
