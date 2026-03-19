import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Camera, Loader2, AlertCircle, CheckCircle, X, MessageCircle, History, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ListenButton } from "@/components/ui/ListenButton";
import { diagnosePest, uploadPestImage } from "@/services/pestDiagnosisService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface DiagnosisResult {
  pest: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  description: string;
  treatment: string[];
  prevention: string[];
}

interface DiagnosisHistory {
  id: string;
  created_at: string;
  pest_identified: string | null;
  crop_type: string | null;
  severity: string | null;
}

const PestDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [resultCache, setResultCache] = useState<Record<string, DiagnosisResult>>({});
  const [history, setHistory] = useState<DiagnosisHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [resultLang, setResultLang] = useState<"en" | "hi">("en");
  const { toast } = useToast();
  const { user } = useAuth();

  const buildPestListenText = () => {
    if (!result) return "";
    let text = `Pest identified: ${result.pest}. Severity: ${result.severity}. ${result.description}. `;
    if (result.treatment.length > 0) text += `Treatment: ${result.treatment.join(". ")}. `;
    if (result.prevention.length > 0) text += `Prevention: ${result.prevention.join(". ")}`;
    return text;
  };

  // Fetch initial history and set up real-time subscription
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setIsLoadingHistory(false);
      return;
    }

    // Fetch initial history
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("pest_diagnoses")
        .select("id, created_at, pest_identified, crop_type, severity")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching history:", error);
      } else {
        setHistory(data || []);
      }
      setIsLoadingHistory(false);
    };

    fetchHistory();

    // Set up real-time subscription
    const channel = supabase
      .channel('pest-diagnoses-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pest_diagnoses',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('New diagnosis received:', payload);
          const newDiagnosis = payload.new as DiagnosisHistory;
          setHistory((prev) => [newDiagnosis, ...prev].slice(0, 10));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'pest_diagnoses',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Diagnosis deleted:', payload);
          const deletedId = payload.old.id;
          setHistory((prev) => prev.filter((item) => item.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select an image under 5MB",
            variant: "destructive",
          });
          return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setResult(null);
      }
    };
    input.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async (langOverride?: "en" | "hi") => {
    const lang = langOverride || resultLang;
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      let imageUrl = uploadedImageUrl;
      
      // Only upload if not already uploaded
      if (!imageUrl && selectedFile) {
        imageUrl = await uploadPestImage(selectedFile);
        setUploadedImageUrl(imageUrl);
      }
      
      if (!imageUrl) return;
      
      const diagnosis = await diagnosePest({ imageUrl, language: lang });
      
      const parsed: DiagnosisResult = {
        pest: diagnosis.pestIdentified,
        confidence: diagnosis.confidence || 0,
        severity: (diagnosis.severity?.charAt(0).toUpperCase() + diagnosis.severity?.slice(1)) as "Low" | "Medium" | "High",
        description: diagnosis.description,
        treatment: diagnosis.treatmentRecommendations?.map((t: any) => 
          typeof t === 'string' ? t : `${t.method}: ${t.description}`
        ) || [],
        prevention: diagnosis.preventiveMeasures || [],
      };
      
      setResultCache(prev => ({ ...prev, [lang]: parsed }));
      setResult(parsed);
      
      toast({
        title: "Analysis Complete",
        description: `Pest identified: ${diagnosis.pestIdentified}`,
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze image";
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (errorMessage.toLowerCase().includes('invalid photo')) {
        handleClear();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLanguageChange = (lang: "en" | "hi") => {
    setResultLang(lang);
    if (resultCache[lang]) {
      setResult(resultCache[lang]);
    } else if (uploadedImageUrl && result) {
      handleAnalyze(lang);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadedImageUrl("");
    setResult(null);
    setResultCache({});
  };

  const getSeverityColor = (severity: string) => {
    const normalizedSeverity = severity?.toLowerCase();
    switch (normalizedSeverity) {
      case "high":
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive";
      case "medium":
        return "bg-accent/10 text-accent border-accent";
      case "low":
        return "bg-primary/10 text-primary border-primary";
      default:
        return "bg-muted/10 text-muted-foreground border-muted";
    }
  };

  const formatSeverity = (severity: string | null) => {
    if (!severity) return "Unknown";
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-1 sm:mb-2">Pest Diagnosis</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload a photo of affected crops for AI-powered pest identification and treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Upload Image</h2>
              
              <div className="space-y-4">
                {!previewUrl ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-12 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop an image, or click to browse
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                      <Button variant="outline" onClick={handleCameraCapture}>
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <p className="text-xs text-muted-foreground mt-4">
                      Supported formats: JPG, PNG, WebP (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleClear}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => handleAnalyze()}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Image...
                        </>
                      ) : (
                        "Analyze Pest"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {result && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold mb-2">{result.pest}</h2>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getSeverityColor(result.severity)}>
                        {result.severity} Severity
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.confidence}% Confidence
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select value={listenLang} onValueChange={setListenLang}>
                      <SelectTrigger className="w-20 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">EN</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                        <SelectItem value="mr">मराठी</SelectItem>
                        <SelectItem value="ta">தமிழ்</SelectItem>
                      </SelectContent>
                    </Select>
                    <ListenButton 
                      text={buildPestListenText()} 
                      language={listenLang}
                      size="sm"
                    />
                    <Button
                      variant={resultLang === "en" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange("en")}
                      className="text-xs px-2 h-7"
                    >
                      EN
                    </Button>
                    <Button
                      variant={resultLang === "hi" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange("hi")}
                      className="text-xs px-2 h-7"
                    >
                      हिं
                    </Button>
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{result.description}</p>

                <Tabs defaultValue="treatment" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="treatment">Treatment</TabsTrigger>
                    <TabsTrigger value="prevention">Prevention</TabsTrigger>
                  </TabsList>
                  <TabsContent value="treatment" className="space-y-3 mt-4">
                    {result.treatment.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="prevention" className="space-y-3 mt-4">
                    {result.prevention.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-heading font-semibold mb-4">Tips for Best Results</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Take clear, well-lit photos of affected areas</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Include close-up shots of damaged leaves or pests</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Capture multiple angles when possible</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Avoid blurry or dark images</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-heading font-semibold">Diagnosis History</h3>
              </div>
              <div className="space-y-3">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : !user ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    <Link to="/auth" className="text-primary hover:underline">
                      Sign in
                    </Link>{" "}
                    to save your diagnosis history
                  </p>
                ) : history.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No diagnosis history yet. Upload an image to get started!
                  </p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium">{item.pest_identified || "Unknown"}</span>
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(item.severity || "")}`}>
                          {formatSeverity(item.severity)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.crop_type || "Unknown crop"} • {format(new Date(item.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PestDiagnosis;
