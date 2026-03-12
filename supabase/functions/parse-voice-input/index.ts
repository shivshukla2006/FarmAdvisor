import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      throw new Error('No transcript provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const systemPrompt = `You are a form field extractor for an Indian farming app. Extract the following fields from the user's voice input about crop recommendations:

1. soilType: Must match one of these exactly: "Loamy (दोमट)", "Clay (चिकनी मिट्टी)", "Sandy (बलुई)", "Silt (गाद)", "Red Soil (लाल मिट्टी)", "Black Soil (काली मिट्टी)", "Alluvial (जलोढ़)"
2. season: Must match one of these exactly: "Kharif (बरसात - Monsoon)", "Rabi (सर्दी - Winter)", "Zaid (गर्मी - Summer)"
3. location: The city/village/district name mentioned
4. selectedCrops: Array of crops matching these options: "Rice (चावल)", "Wheat (गेहूं)", "Cotton (कपास)", "Sugarcane (गन्ना)", "Maize (मक्का)", "Pulses (दालें)", "Vegetables (सब्ज़ियाँ)", "Fruits (फल)"

The user may speak in English, Hindi, or a mix. Match their intent to the closest option.
Return ONLY a JSON object with the fields you could extract. Omit fields you couldn't determine.
Example: {"soilType": "Clay (चिकनी मिट्टी)", "season": "Kharif (बरसात - Monsoon)", "location": "Pune", "selectedCrops": ["Rice (चावल)", "Wheat (गेहूं)"]}`;

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: transcript },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API error:', errText);
      throw new Error('Failed to parse voice input');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in parse-voice-input:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
