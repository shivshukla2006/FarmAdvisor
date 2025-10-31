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
    const { imageUrl, cropType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const prompt = `You are an expert plant pathologist and agricultural pest specialist. Analyze this image of a crop plant and identify any pests, diseases, or issues.

${cropType ? `Crop Type: ${cropType}` : ''}

Please provide a detailed analysis in JSON format:
{
  "pestIdentified": "name of pest/disease or 'None detected'",
  "confidence": number (0-100),
  "severity": "low/medium/high/critical",
  "description": "detailed description of the issue",
  "symptoms": ["symptom1", "symptom2"],
  "causes": "explanation of causes",
  "treatmentRecommendations": [
    {
      "method": "treatment method name",
      "description": "detailed description",
      "timing": "when to apply",
      "precautions": "safety precautions"
    }
  ],
  "preventiveMeasures": ["measure1", "measure2"],
  "affectedParts": ["plant part1", "plant part2"],
  "spreadRisk": "low/medium/high"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
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
    const diagnosis = JSON.parse(aiResponse.choices[0].message.content);

    // Save to database
    const { data: savedDiagnosis, error: dbError } = await supabaseClient
      .from('pest_diagnoses')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        crop_type: cropType,
        pest_identified: diagnosis.pestIdentified,
        severity: diagnosis.severity,
        diagnosis_result: diagnosis,
        treatment_recommendations: diagnosis.treatmentRecommendations.map((t: any) => t.method),
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
      activity_type: 'diagnosis',
      title: 'Pest diagnosis completed',
      description: `Identified: ${diagnosis.pestIdentified}`,
      reference_id: savedDiagnosis.id
    });

    console.log('Pest diagnosis completed successfully');

    return new Response(JSON.stringify(diagnosis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in pest-diagnosis function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
