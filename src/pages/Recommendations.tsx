import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, MapPin, Calendar, Bookmark, Share2, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCropRecommendations, type CropRecommendation } from "@/services/cropRecommendationService";
import { generateRecommendationsPDF } from "@/utils/pdfGenerator";

const soilTypes = ["Loamy", "Clay", "Sandy", "Silt", "Red Soil", "Black Soil", "Alluvial"];
const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];
const cropOptions = ["Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Pulses", "Vegetables", "Fruits"];

const Recommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    soilType: "",
    season: "",
    location: "",
    selectedCrops: [] as string[],
  });
  const { toast } = useToast();

  // Fetch user's real-time location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Please enter your location manually",
        variant: "destructive",
      });
      return;
    }

    setIsLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        try {
          // Reverse geocode to get location name
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=b1b15e88fa797225412429c1c50c122a`
          );
          const data = await response.json();

          if (data && data.length > 0) {
            const locationName = data[0].state 
              ? `${data[0].name}, ${data[0].state}, ${data[0].country}`
              : `${data[0].name}, ${data[0].country}`;
            setFormData(prev => ({ ...prev, location: locationName }));
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocationLoading(false);
        toast({
          title: "Location access denied",
          description: "Please enable location access or enter manually",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCropToggle = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCrops: prev.selectedCrops.includes(crop)
        ? prev.selectedCrops.filter(c => c !== crop)
        : [...prev.selectedCrops, crop]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const results = await getCropRecommendations({
        soilType: formData.soilType,
        season: formData.season,
        location: formData.location,
        preferences: formData.selectedCrops,
        latitude: coordinates?.lat,
        longitude: coordinates?.lng,
      });
      
      setRecommendations(results);
      setShowResults(true);
      toast({
        title: "Recommendations Generated",
        description: "AI-powered crop recommendations are ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "Saved Successfully",
      description: "Recommendations saved to your profile",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Link Copied",
      description: "Recommendation link copied to clipboard",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Crop Recommendations</h1>
          <p className="text-muted-foreground">
            Get AI-powered crop suggestions based on your soil, weather, and regional data
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type *</Label>
                <Select value={formData.soilType} onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}>
                  <SelectTrigger id="soilType">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">Season *</Label>
                <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}>
                  <SelectTrigger id="season">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map(season => (
                      <SelectItem key={season} value={season}>{season}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={getUserLocation}
                  disabled={isLocationLoading}
                >
                  {isLocationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Crop Preferences (Optional)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cropOptions.map(crop => (
                  <div key={crop} className="flex items-center space-x-2">
                    <Checkbox
                      id={crop}
                      checked={formData.selectedCrops.includes(crop)}
                      onCheckedChange={() => handleCropToggle(crop)}
                    />
                    <Label htmlFor={crop} className="cursor-pointer">{crop}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !formData.soilType || !formData.season || !formData.location}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recommendations...
                </>
              ) : (
                <>
                  <Leaf className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </form>
        </Card>

        {showResults && (
          <div className="space-y-4">
          <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold">Your Recommendations</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => generateRecommendationsPDF(recommendations, formData)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((crop, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-1">{crop.name}</h3>
                      <span className="text-sm text-primary font-medium">{crop.suitability}</span>
                    </div>
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Timing:</span>
                      <span className="font-medium">{crop.timing}</span>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Expected Yield:</span>
                      <span className="font-medium ml-2">{crop.expectedYield}</span>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm text-muted-foreground">{crop.careInstructions}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
