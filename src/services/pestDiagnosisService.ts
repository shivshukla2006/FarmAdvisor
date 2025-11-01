import { supabase } from "@/integrations/supabase/client";

export interface PestDiagnosisInput {
  imageUrl: string;
  cropType?: string;
}

export interface PestDiagnosisResult {
  pestIdentified: string;
  severity: string;
  treatmentRecommendations: string[];
  description: string;
}

export const diagnosePest = async (
  input: PestDiagnosisInput
): Promise<PestDiagnosisResult> => {
  const { data, error } = await supabase.functions.invoke("pest-diagnosis", {
    body: input,
  });

  if (error) {
    console.error("Error diagnosing pest:", error);
    throw new Error("Failed to diagnose pest. Please try again.");
  }

  return data;
};

export const uploadPestImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `pest-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("pest-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw new Error("Failed to upload image. Please try again.");
  }

  const { data: { publicUrl } } = supabase.storage
    .from("pest-images")
    .getPublicUrl(filePath);

  return publicUrl;
};
