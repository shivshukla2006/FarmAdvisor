import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, MapPin, Calendar, Bookmark, Share2, Loader2, Download, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCropRecommendations, type CropRecommendation } from "@/services/cropRecommendationService";
import { generateRecommendationsPDF } from "@/utils/pdfGenerator";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { ListenButton } from "@/components/ui/ListenButton";
import { supabase } from "@/integrations/supabase/client";

const soilTypes = ["Loamy (दोमट)", "Clay (चिकनी मिट्टी)", "Sandy (बलुई)", "Silt (गाद)", "Red Soil (लाल मिट्टी)", "Black Soil (काली मिट्टी)", "Alluvial (जलोढ़)"];
const seasons = ["Kharif (बरसात - Monsoon)", "Rabi (सर्दी - Winter)", "Zaid (गर्मी - Summer)"];
const cropOptions = ["Rice (चावल)", "Wheat (गेहूं)", "Cotton (कपास)", "Sugarcane (गन्ना)", "Maize (मक्का)", "Pulses (दालें)", "Vegetables (सब्ज़ियाँ)", "Fruits (फल)"];

const Recommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    soilType: "",
    season: "",
    location: "",
    selectedCrops: [] as string[],
  });
  const [listenLang, setListenLang] = useState<string>("en");
  const { toast } = useToast();

  const voiceInput = useVoiceInput({
    language: "en-IN",
    onError: (error) => {
      toast({
        title: "Voice Input Error",
        description: error === "not-allowed" 
          ? "Please allow microphone access to use voice input" 
          : `Error: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleVoiceSubmit = async () => {
    if (voiceInput.transcript.trim()) {
      await parseVoiceInput(voiceInput.transcript.trim());
    }
  };

  const parseVoiceInput = async (transcript: string) => {
    setIsParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke("parse-voice-input", {
        body: { transcript },
      });

      if (error) throw error;

      if (data.soilType) setFormData(prev => ({ ...prev, soilType: data.soilType }));
      if (data.season) setFormData(prev => ({ ...prev, season: data.season }));
      if (data.location) setFormData(prev => ({ ...prev, location: data.location }));
      if (data.selectedCrops?.length) setFormData(prev => ({ ...prev, selectedCrops: data.selectedCrops }));

      const filled = [data.soilType && "soil type", data.season && "season", data.location && "location", data.selectedCrops?.length && "crops"].filter(Boolean);
      toast({
        title: "Voice Input Processed",
        description: filled.length > 0 ? `Filled: ${filled.join(", ")}` : "Couldn't extract details. Please try again.",
      });
    } catch (error) {
      console.error("Error parsing voice input:", error);
      toast({
        title: "Parse Error",
        description: "Failed to process voice input. Please try again or fill the form manually.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

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

  const buildListenText = (crop: CropRecommendation) => {
    return `${crop.name}. Suitability: ${crop.suitability}. Timing: ${crop.timing}. Expected Yield: ${crop.expectedYield}. Care Instructions: ${crop.careInstructions}`;
  };

  const buildFullListenText = () => {
    return recommendations.map(crop => buildListenText(crop)).join(". Next recommendation: ");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-1 sm:mb-2">Crop Recommendations</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Get AI-powered crop suggestions based on your soil, weather, and regional data
          </p>
        </div>

        <Card className="p-6">
          {/* Voice Input Section */}
          <div className="mb-6 p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                type="button"
                variant={voiceInput.isListening ? "default" : "outline"}
                size="lg"
                onClick={voiceInput.toggleListening}
                disabled={!voiceInput.isSupported || isParsing}
                className={`gap-2 ${voiceInput.isListening ? "animate-pulse bg-destructive hover:bg-destructive/90" : ""}`}
              >
                {voiceInput.isListening ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Speak Your Details
                  </>
                )}
              </Button>
              {!voiceInput.isListening && voiceInput.transcript && !isParsing && (
                <Button
                  type="button"
                  size="lg"
                  onClick={handleVoiceSubmit}
                  className="gap-2"
                >
                  <Leaf className="h-5 w-5" />
                  Submit Voice Input
                </Button>
              )}
              {isParsing && (
                <Button type="button" size="lg" disabled className="gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </Button>
              )}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {voiceInput.isListening 
                    ? "Listening... Say something like: \"My soil is clay, I'm in Pune, season is Kharif, I want to grow rice and wheat\""
                    : voiceInput.transcript 
                      ? "Review what was heard, then click 'Submit Voice Input' to fill the form"
                      : "Click to speak all your farming details at once — soil type, location, season, and crops"}
                </p>
                {voiceInput.transcript && (
                  <div className="flex items-start gap-2 mt-2">
                    <p className="text-sm p-2 bg-background rounded border flex-1">
                      <span className="text-muted-foreground">Heard: </span>
                      <span className="font-medium">{voiceInput.transcript}</span>
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => voiceInput.clearTranscript()}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      ✕ Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-heading font-bold">Your Recommendations</h2>
              <div className="flex gap-2 flex-wrap items-center">
                {/* Language selector for listen */}
                <Select value={listenLang} onValueChange={setListenLang}>
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                  </SelectContent>
                </Select>
                <ListenButton 
                  text={buildFullListenText()} 
                  language={listenLang}
                  label="Listen All"
                />
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Bookmark className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => generateRecommendationsPDF(recommendations, formData)}
                >
                  <Download className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Download</span> PDF
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
                    <div className="flex items-center gap-1">
                      <ListenButton 
                        text={buildListenText(crop)} 
                        language={listenLang}
                        size="icon"
                        variant="ghost"
                      />
                      <Leaf className="h-8 w-8 text-primary" />
                    </div>
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
