import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Camera, Loader2, AlertCircle, CheckCircle, X, Leaf, Shield, Beaker, TreeDeciduous, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { diagnoseLeaf, uploadLeafImage, type LeafDiagnosisResult } from "@/services/leafDiagnosisService";

const LeafDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<LeafDiagnosisResult | null>(null);
  const [resultLang, setResultLang] = useState<"en" | "hi">("en");
  const { toast } = useToast();

  const handleCameraCapture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
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
        toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
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
      if (!imageUrl && selectedFile) {
        imageUrl = await uploadLeafImage(selectedFile);
        setUploadedImageUrl(imageUrl);
      }
      if (!imageUrl) return;
      
      const diagnosis = await diagnoseLeaf({ imageUrl, language: lang });
      setResult(diagnosis);
      toast({ title: "Analysis Complete", description: `Disease identified: ${diagnosis.diseaseName}` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze image";
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" });
      if (errorMessage.toLowerCase().includes("invalid photo")) handleClear();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLanguageChange = (lang: "en" | "hi") => {
    setResultLang(lang);
    if (uploadedImageUrl && result) {
      handleAnalyze(lang);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadedImageUrl("");
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-1 sm:mb-2 flex items-center gap-2">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            Leaf Disease Diagnosis
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload a photo of a leaf to identify diseases, get treatment options, and prevention tips
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Upload Leaf Image</h2>
              <div className="space-y-4">
                {!previewUrl ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-12 text-center hover:border-primary/50 transition-colors">
                    <TreeDeciduous className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a clear photo of the affected leaf
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => document.getElementById("leaf-upload")?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                      <Button variant="outline" onClick={handleCameraCapture}>
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                    <Input id="leaf-upload" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                    <p className="text-xs text-muted-foreground mt-4">
                      Supported formats: JPG, PNG, WebP (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border">
                      <img src={previewUrl} alt="Leaf preview" className="w-full h-auto" />
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleClear}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button className="w-full" onClick={() => handleAnalyze()} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Leaf...
                        </>
                      ) : (
                        <>
                          <Leaf className="mr-2 h-4 w-4" />
                          Diagnose Leaf Disease
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Results */}
            {result && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold mb-2">{result.diseaseName}</h2>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className={getSeverityColor(result.severity)}>
                        {result.severity?.charAt(0).toUpperCase() + result.severity?.slice(1)} Severity
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.confidence}% Confidence
                      </span>
                      <Badge variant="outline" className={`text-xs ${result.spreadRisk === 'high' ? 'border-destructive text-destructive' : 'border-muted'}`}>
                        Spread Risk: {result.spreadRisk}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={resultLang === "en" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange("en")}
                      className="text-xs px-2 h-7"
                      disabled={isAnalyzing}
                    >
                      EN
                    </Button>
                    <Button
                      variant={resultLang === "hi" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange("hi")}
                      className="text-xs px-2 h-7"
                      disabled={isAnalyzing}
                    >
                      हिं
                    </Button>
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Plant Identification */}
                {(result.plantName || result.leafType) && (
                  <div className="mb-4 p-4 rounded-lg border bg-primary/5">
                    <h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
                      <TreeDeciduous className="h-4 w-4 text-primary" />
                      Plant Identification
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {result.plantName && (
                        <div>
                          <span className="text-muted-foreground">Botanical Name: </span>
                          <span className="font-medium italic">{result.plantName}</span>
                        </div>
                      )}
                      {result.plantFamily && (
                        <div>
                          <span className="text-muted-foreground">Family: </span>
                          <span className="font-medium">{result.plantFamily}</span>
                        </div>
                      )}
                      {result.leafType && (
                        <div>
                          <span className="text-muted-foreground">Leaf Type: </span>
                          <span className="font-medium">{result.leafType}</span>
                        </div>
                      )}
                      {result.plantCommonNames?.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Common Names: </span>
                          <span className="font-medium">{result.plantCommonNames.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-muted-foreground mb-4">{result.description}</p>

                {/* Symptoms */}
                {result.symptoms?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-heading font-semibold mb-2">Symptoms Observed</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.symptoms.map((s, i) => (
                        <Badge key={i} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Causes */}
                {result.causes && (
                  <div className="mb-4 p-3 rounded-lg bg-muted/50">
                    <h3 className="font-heading font-semibold mb-1">Cause</h3>
                    <p className="text-sm text-muted-foreground">{result.causes}</p>
                  </div>
                )}

                {/* Affected Crops */}
                {result.affectedCrops?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-heading font-semibold mb-2">Commonly Affected Crops</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.affectedCrops.map((c, i) => (
                        <Badge key={i} variant="outline">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Tabs defaultValue="treatment" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="treatment">Treatment</TabsTrigger>
                    <TabsTrigger value="organic">Organic Remedies</TabsTrigger>
                    <TabsTrigger value="prevention">Prevention</TabsTrigger>
                  </TabsList>

                  <TabsContent value="treatment" className="space-y-3 mt-4">
                    {result.treatmentRecommendations?.map((t, i) => (
                      <div key={i} className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Beaker className="h-4 w-4 text-primary" />
                          <span className="font-medium">{t.method}</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">{t.description}</p>
                        {t.timing && <p className="text-xs text-muted-foreground ml-6 mt-1">⏱ Timing: {t.timing}</p>}
                        {t.precautions && <p className="text-xs text-destructive/80 ml-6 mt-1">⚠ {t.precautions}</p>}
                      </div>
                    ))}
                    {result.chemicalTreatments?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Chemical Treatments</h4>
                        {result.chemicalTreatments.map((ct, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm mb-2">
                            <span className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-xs font-medium text-accent">{i + 1}</span>
                            <span className="text-muted-foreground">{ct}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="organic" className="space-y-3 mt-4">
                    {result.organicRemedies?.map((r, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Leaf className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{r}</p>
                      </div>
                    ))}
                    {(!result.organicRemedies || result.organicRemedies.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">No organic remedies available for this disease.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="prevention" className="space-y-3 mt-4">
                    {result.preventionMeasures?.map((p, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{p}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </div>

          {/* Sidebar Tips */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-heading font-semibold mb-4">Tips for Best Results</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Photograph the leaf flat against a plain background</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Capture both the top and bottom of the leaf</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Include close-ups of spots, discoloration, or damage</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Use natural lighting for accurate color representation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-heading font-semibold mb-3">Common Leaf Diseases</h3>
              <div className="space-y-2">
                {[
                  "Leaf Blight",
                  "Powdery Mildew",
                  "Rust Disease",
                  "Leaf Spot",
                  "Downy Mildew",
                  "Leaf Curl",
                  "Anthracnose",
                  "Mosaic Virus",
                ].map((disease) => (
                  <div key={disease} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Leaf className="h-3 w-3 text-primary" />
                    <span className="text-muted-foreground">{disease}</span>
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

export default LeafDiagnosis;
