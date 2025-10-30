import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, MapPin, Calendar, Bookmark, Share2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const soilTypes = ["Loamy", "Clay", "Sandy", "Silt", "Red Soil", "Black Soil", "Alluvial"];
const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];
const cropOptions = ["Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Pulses", "Vegetables", "Fruits"];

const Recommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    soilType: "",
    season: "",
    location: "",
    selectedCrops: [] as string[],
  });
  const { toast } = useToast();

  const handleCropToggle = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCrops: prev.selectedCrops.includes(crop)
        ? prev.selectedCrops.filter(c => c !== crop)
        : [...prev.selectedCrops, crop]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      toast({
        title: "Recommendations Generated",
        description: "AI-powered crop recommendations are ready!",
      });
    }, 2000);
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
                <Button type="button" variant="outline" size="icon">
                  <MapPin className="h-4 w-4" />
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Rice",
                  suitability: "Highly Recommended",
                  timing: "Plant in June-July",
                  yield: "4-5 tons/acre",
                  care: "Requires consistent water supply and warm temperatures",
                },
                {
                  name: "Cotton",
                  suitability: "Recommended",
                  timing: "Plant in May-June",
                  yield: "15-20 quintals/acre",
                  care: "Needs moderate rainfall and well-drained soil",
                },
                {
                  name: "Sugarcane",
                  suitability: "Suitable",
                  timing: "Plant in February-March",
                  yield: "40-50 tons/acre",
                  care: "Requires heavy irrigation and rich soil",
                },
              ].map((crop, index) => (
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
                      <span className="font-medium ml-2">{crop.yield}</span>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm text-muted-foreground">{crop.care}</p>
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
