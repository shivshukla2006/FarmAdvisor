import { supabase } from "@/integrations/supabase/client";

export interface CropRecommendationInput {
  soilType: string;
  season: string;
  location: string;
  preferences?: string[];
  latitude?: number;
  longitude?: number;
}

export interface CropRecommendation {
  name: string;
  suitability: string;
  timing: string;
  expectedYield: string;
  careInstructions: string;
}

export const getCropRecommendations = async (
  input: CropRecommendationInput
): Promise<CropRecommendation[]> => {
  const { data, error } = await supabase.functions.invoke("crop-recommendation", {
    body: input,
  });

  if (error) {
    console.error("Error fetching crop recommendations:", error);
    throw new Error("Failed to get crop recommendations. Please try again.");
  }

  return data.recommendations || [];
};
