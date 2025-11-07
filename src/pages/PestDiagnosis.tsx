import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Camera, Loader2, AlertCircle, CheckCircle, X, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { diagnosePest, uploadPestImage } from "@/services/pestDiagnosisService";

interface DiagnosisResult {
  pest: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  description: string;
  treatment: string[];
  prevention: string[];
}

const mockHistory = [
  {
    id: 1,
    date: "2024-10-25",
    pest: "Aphids",
    crop: "Cotton",
    severity: "Medium",
  },
  {
    id: 2,
    date: "2024-10-20",
    pest: "Leaf Miner",
    crop: "Tomato",
    severity: "Low",
  },
  {
    id: 3,
    date: "2024-10-15",
    pest: "Bollworm",
    crop: "Cotton",
    severity: "High",
  },
];

const PestDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const { toast } = useToast();

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

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      // Upload image to storage
      const imageUrl = await uploadPestImage(selectedFile);
      
      // Diagnose the pest
      const diagnosis = await diagnosePest({ imageUrl });
      
      // Transform the diagnosis result to match our UI format
      setResult({
        pest: diagnosis.pestIdentified,
        confidence: diagnosis.confidence || 0,
        severity: (diagnosis.severity?.charAt(0).toUpperCase() + diagnosis.severity?.slice(1)) as "Low" | "Medium" | "High",
        description: diagnosis.description,
        treatment: diagnosis.treatmentRecommendations?.map((t: any) => 
          typeof t === 'string' ? t : `${t.method}: ${t.description}`
        ) || [],
        prevention: diagnosis.preventiveMeasures || [],
      });
      
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
      
      // Clear the image if it's invalid
      if (errorMessage.toLowerCase().includes('invalid photo')) {
        handleClear();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive";
      case "Medium":
        return "bg-accent/10 text-accent border-accent";
      case "Low":
        return "bg-primary/10 text-primary border-primary";
      default:
        return "bg-muted/10 text-muted-foreground border-muted";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Pest Diagnosis</h1>
          <p className="text-muted-foreground">
            Upload a photo of affected crops for AI-powered pest identification and treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Upload Image</h2>
              
              <div className="space-y-4">
                {!previewUrl ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop an image, or click to browse
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                      <Button variant="outline">
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
                      onClick={handleAnalyze}
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
                  <CheckCircle className="h-8 w-8 text-primary" />
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

                <div className="mt-6 pt-6 border-t">
                  <Link to="/community">
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Get Help from Community
                    </Button>
                  </Link>
                </div>
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
              <h3 className="text-lg font-heading font-semibold mb-4">Diagnosis History</h3>
              <div className="space-y-3">
                {mockHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium">{item.pest}</span>
                      <Badge variant="outline" className={`text-xs ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.crop} • {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PestDiagnosis;
