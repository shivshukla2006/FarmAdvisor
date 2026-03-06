import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Input validation
const validateImageUrl = (url: string): boolean => {
  if (!url || url.length > 2000) return false;
  
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'https:') return false;
    
    const allowedDomains = [
      'supabase.co',
      'btspzagknvsbzyhwfvkh.supabase.co'
    ];
    
    const isAllowed = allowedDomains.some(domain => 
      parsedUrl.hostname.endsWith(domain)
    );
    
    return isAllowed;
  } catch {
    return false;
  }
};

const validateCropType = (cropType?: string): boolean => {
  if (!cropType) return true;
  return cropType.length > 0 && cropType.length <= 100;
};

// Helper function to clean markdown formatting from JSON responses
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
    const { imageUrl, cropType, language } = await req.json();
    const responseLanguage = language === 'hi' ? 'Hindi' : 'English';

    if (!validateImageUrl(imageUrl)) {
      throw new Error('Invalid image URL: must be a valid HTTPS URL from allowed storage');
    }

    if (!validateCropType(cropType)) {
      throw new Error('Invalid crop type: must be 1-100 characters');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Authentication is optional
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
        console.log('User authenticated:', user.id);
      }
    }

    // Single combined prompt for validation + diagnosis (faster than 2 calls)
    console.log('Performing pest diagnosis...');
    const combinedPrompt = `You are an expert plant pathologist and agricultural pest specialist. 

FIRST: Determine if this image shows agricultural content (crops, plants, pests, diseases, plant damage, insects affecting plants).

If the image does NOT show agricultural content (random objects, people, non-pest animals, buildings, vehicles, food/cooked dishes, indoor scenes), respond with:
{
  "isValid": false,
  "reason": "brief explanation why this is not agricultural content"
}

If the image DOES show agricultural content, analyze it and respond with:
{
  "isValid": true,
  "pestIdentified": "name of pest/disease or 'None detected'",
  "confidence": number (0-100),
  "severity": "low" | "medium" | "high" | "critical",
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
  "spreadRisk": "low" | "medium" | "high"
}

${cropType ? `Crop Type: ${cropType}` : ''}

IMPORTANT: Provide ALL text content (descriptions, symptoms, causes, treatment descriptions, preventive measures, method names, timing, precautions) in ${responseLanguage} language.`;

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

    // Check if image was invalid
    if (result.isValid === false) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid photo',
          message: 'The uploaded image does not appear to show crops, plants, pests, or agricultural content. Please upload a clear photo of affected plants or crop damage.',
          reason: result.reason
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Remove isValid from the diagnosis result
    const { isValid, ...diagnosis } = result;

    // Save to database only if user is authenticated
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
          crop_type: cropType,
          pest_identified: diagnosis.pestIdentified,
          severity: diagnosis.severity,
          diagnosis_result: diagnosis,
          treatment_recommendations: diagnosis.treatmentRecommendations?.map((t: any) => t.method) || [],
          status: 'completed'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
      } else {
        // Log activity
        await supabaseClient.from('user_activities').insert({
          user_id: user.id,
          activity_type: 'diagnosis',
          title: 'Pest diagnosis completed',
          description: `Identified: ${diagnosis.pestIdentified}`,
          reference_id: savedDiagnosis.id
        });
      }
    }

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
