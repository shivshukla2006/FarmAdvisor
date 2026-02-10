import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const validateImageUrl = (url: string): boolean => {
  if (!url || url.length > 2000) return false;
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'https:') return false;
    const allowedDomains = ['supabase.co', 'btspzagknvsbzyhwfvkh.supabase.co'];
    return allowedDomains.some(domain => parsedUrl.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

function cleanJsonResponse(content: string): string {
  let cleaned = content.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, cropType } = await req.json();

    if (!validateImageUrl(imageUrl)) {
      throw new Error('Invalid image URL: must be a valid HTTPS URL from allowed storage');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const authHeader = req.headers.get('Authorization');
    let user = null;

    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user: authUser }, error: authErr } = await supabaseClient.auth.getUser();
      if (!authErr && authUser) {
        user = authUser;
      }
    }

    const combinedPrompt = `You are an expert plant pathologist specializing in leaf diseases. 

FIRST: Determine if this image shows a leaf or plant foliage suitable for disease analysis.

If the image does NOT show leaves or plant foliage (random objects, people, non-plant items, buildings, vehicles, food/cooked dishes, indoor scenes), respond with:
{
  "isValid": false,
  "reason": "brief explanation why this is not a leaf image"
}

If the image DOES show leaves/plant foliage, analyze it for diseases and respond with:
{
  "isValid": true,
  "diseaseName": "name of leaf disease or 'Healthy - No Disease Detected'",
  "confidence": number (0-100),
  "severity": "low" | "medium" | "high" | "critical",
  "description": "detailed description of the disease and how it affects the plant",
  "symptoms": ["visible symptom 1", "visible symptom 2"],
  "causes": "what causes this disease (fungal, bacterial, viral, nutrient deficiency, environmental stress, etc.)",
  "affectedCrops": ["list of crops commonly affected by this disease"],
  "treatmentRecommendations": [
    {
      "method": "treatment method name",
      "description": "detailed how-to description",
      "timing": "when to apply",
      "precautions": "safety precautions"
    }
  ],
  "preventionMeasures": ["prevention measure 1", "prevention measure 2"],
  "spreadRisk": "low" | "medium" | "high",
  "organicRemedies": ["organic/natural remedy 1", "organic/natural remedy 2"],
  "chemicalTreatments": ["chemical treatment 1 with dosage", "chemical treatment 2 with dosage"]
}

${cropType ? `Crop Type: ${cropType}` : ''}
Provide actionable, farmer-friendly advice. Include both organic and chemical treatment options.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: combinedPrompt },
              { type: 'image_url', image_url: { url: imageUrl } }
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
    const cleanedResponse = cleanJsonResponse(aiResponse.choices[0].message.content);
    const result = JSON.parse(cleanedResponse);

    if (result.isValid === false) {
      return new Response(
        JSON.stringify({
          error: 'Invalid photo',
          message: 'The uploaded image does not appear to show leaves or plant foliage. Please upload a clear photo of a leaf for disease diagnosis.',
          reason: result.reason
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { isValid, ...diagnosis } = result;

    // Save to database if user is authenticated
    if (user) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader! } } }
      );

      const { data: savedDiagnosis, error: dbError } = await supabaseClient
        .from('pest_diagnoses')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          crop_type: cropType || 'leaf-diagnosis',
          pest_identified: diagnosis.diseaseName,
          severity: diagnosis.severity,
          diagnosis_result: { ...diagnosis, type: 'leaf_disease' },
          treatment_recommendations: diagnosis.treatmentRecommendations?.map((t: any) => t.method) || [],
          status: 'completed'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
      } else {
        await supabaseClient.from('user_activities').insert({
          user_id: user.id,
          activity_type: 'diagnosis',
          title: 'Leaf disease diagnosis completed',
          description: `Identified: ${diagnosis.diseaseName}`,
          reference_id: savedDiagnosis.id
        });
      }
    }

    return new Response(JSON.stringify(diagnosis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in leaf-diagnosis function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
