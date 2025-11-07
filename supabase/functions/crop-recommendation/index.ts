import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { soilType, season, location, preferences, latitude, longitude } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No Authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    const prompt = `You are an expert agricultural advisor. Based on the following information, provide detailed crop recommendations:

Soil Type: ${soilType}
Season: ${season}
Location: ${location}
${latitude && longitude ? `Coordinates: ${latitude}, ${longitude}` : ''}
${preferences?.length ? `Crop Preferences: ${preferences.join(', ')}` : ''}

Please provide:
1. 3-5 recommended crops suitable for these conditions
2. For each crop:
   - Planting timing and duration
   - Expected yield
   - Water requirements
   - Fertilizer recommendations
   - Pest management tips
   - Market potential

Format your response as a structured JSON with this schema:
{
  "recommendations": [
    {
      "cropName": "string",
      "suitabilityScore": number (0-100),
      "plantingPeriod": "string",
      "duration": "string",
      "expectedYield": "string",
      "waterRequirements": "string",
      "fertilizerPlan": "string",
      "pestManagement": "string",
      "marketPotential": "string",
      "additionalTips": "string"
    }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert agricultural advisor with deep knowledge of crop science, soil management, and farming practices. Provide accurate, practical recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please upgrade your plan.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI request failed');
    }

    const aiResponse = await response.json();
    const aiData = JSON.parse(aiResponse.choices[0].message.content);
    
    // Transform AI response to match frontend expectations
    const transformedRecommendations = aiData.recommendations.map((rec: any) => ({
      name: rec.cropName,
      suitability: `${rec.suitabilityScore}% suitable`,
      timing: `${rec.plantingPeriod} (${rec.duration})`,
      expectedYield: rec.expectedYield,
      careInstructions: `${rec.waterRequirements} | ${rec.fertilizerPlan}`,
      pestManagement: rec.pestManagement,
      marketPotential: rec.marketPotential,
      additionalTips: rec.additionalTips
    }));

    const recommendations = {
      recommendations: transformedRecommendations
    };

    // Save to database
    const { data: savedRec, error: dbError } = await supabaseClient
      .from('crop_recommendations')
      .insert({
        user_id: user.id,
        soil_type: soilType,
        season,
        location,
        preferences,
        latitude,
        longitude,
        recommendations,
        status: 'completed'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    // Log activity
    await supabaseClient.from('user_activities').insert({
      user_id: user.id,
      activity_type: 'recommendation',
      title: 'Generated crop recommendation',
      description: `Recommendations for ${location} - ${season} season`,
      reference_id: savedRec.id
    });

    console.log('Crop recommendations generated successfully');

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in crop-recommendation function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
