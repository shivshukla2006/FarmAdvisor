import { supabase } from "@/integrations/supabase/client";

export interface LeafDiagnosisInput {
  imageUrl: string;
  cropType?: string;
}

export interface LeafDiagnosisResult {
  diseaseName: string;
  confidence: number;
  severity: string;
  description: string;
  symptoms: string[];
  causes: string;
  affectedCrops: string[];
  treatmentRecommendations: { method: string; description: string; timing: string; precautions: string }[];
  preventionMeasures: string[];
  spreadRisk: string;
  organicRemedies: string[];
  chemicalTreatments: string[];
}

export const diagnoseLeaf = async (input: LeafDiagnosisInput): Promise<LeafDiagnosisResult> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  const { data, error } = await supabase.functions.invoke("leaf-diagnosis", {
    body: input,
    headers,
  });

  if (error) {
    if ((error as any).message?.includes('Invalid photo') || (error as any).context?.body?.error === 'Invalid photo') {
      throw new Error('Invalid photo: Please upload a clear image of a leaf for disease diagnosis.');
    }
    throw new Error("Failed to diagnose leaf disease. Please try again.");
  }

  if ((data as any)?.error === 'Invalid photo') {
    throw new Error((data as any).message || 'Invalid photo: Please upload a clear image of a leaf.');
  }

  return data as LeafDiagnosisResult;
};

export const uploadLeafImage = async (file: File): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in to upload images");

  const fileExt = file.name.split(".").pop();
  const fileName = `leaf-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("pest-images")
    .upload(filePath, file);

  if (uploadError) throw new Error("Failed to upload image. Please try again.");

  const { data: { publicUrl } } = supabase.storage
    .from("pest-images")
    .getPublicUrl(filePath);

  return publicUrl;
};
