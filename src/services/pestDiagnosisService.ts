import { supabase } from "@/integrations/supabase/client";

export interface PestDiagnosisInput {
  imageUrl: string;
  cropType?: string;
}

export interface PestDiagnosisResult {
  pestIdentified: string;
  confidence?: number;
  severity: string;
  treatmentRecommendations: string[];
  description: string;
  preventiveMeasures?: string[];
}

export const diagnosePest = async (
  input: PestDiagnosisInput
): Promise<PestDiagnosisResult> => {
  // supabase.functions.invoke automatically handles authentication
  const { data, error } = await supabase.functions.invoke("pest-diagnosis", {
    body: input,
  });

  if (error) {
    console.error("Error diagnosing pest:", error);

    // Surface Unauthorized explicitly
    if ((error as any).status === 401 || (error as any).message?.includes("Unauthorized")) {
      throw new Error("Your session expired. Please sign in again.");
    }

    // Check if it's an invalid photo error
    if ((error as any).message?.includes('Invalid photo') || (error as any).context?.body?.error === 'Invalid photo') {
      throw new Error('Invalid photo: Please upload a clear image of crops, plants, pests, or agricultural damage.');
    }

    throw new Error("Failed to diagnose pest. Please try again.");
  }

  // Handle 400 error from edge function
  if ((data as any)?.error === 'Invalid photo') {
    throw new Error((data as any).message || 'Invalid photo: Please upload a clear image of crops, plants, pests, or agricultural damage.');
  }

  return data as PestDiagnosisResult;
};

export const uploadPestImage = async (file: File): Promise<string> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("You must be logged in to upload images");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

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
