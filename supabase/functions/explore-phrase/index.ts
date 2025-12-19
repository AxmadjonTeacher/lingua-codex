import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phrase } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!phrase) {
      throw new Error('Phrase is required');
    }

    console.log(`Exploring phrase: "${phrase}"`);

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
            content: `You are a language learning assistant for Uzbek speakers learning English.
Your task is to explain English phrases/words with their meaning in Uzbek, provide a simple English example, and give 3 real-life situational examples.

ALWAYS respond in this exact JSON format:
{
  "explanation": "The meaning of the phrase explained in Uzbek. Start with the phrase itself, then explain what it means in Uzbek.",
  "simpleExample": {
    "sentence": "A simple English sentence using the phrase",
    "explanation": ""
  },
  "scenarios": [
    {
      "context": "Work / Career",
      "sentence": "A natural English sentence using the phrase in this context",
      "explanation": ""
    },
    {
      "context": "Health / Lifestyle", 
      "sentence": "A natural English sentence using the phrase in this context",
      "explanation": ""
    },
    {
      "context": "Technology / Convenience",
      "sentence": "A natural English sentence using the phrase in this context",
      "explanation": ""
    }
  ]
}

Important guidelines:
- The "explanation" field MUST be in Uzbek and should explain the meaning, nuance, and when the phrase is typically used
- All "sentence" fields should be in English
- The scenario contexts should be relevant to the phrase (choose appropriate contexts like Work/Career, Health/Lifestyle, Technology, Relationships, Education, Daily Life, etc.)
- Make the examples practical and relatable`
          },
          {
            role: 'user',
            content: `Explain the English phrase or word: "${phrase}"`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error response:", errorText);
      throw new Error("Failed to generate exploration");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
        throw new Error("No content received from AI");
    }

    console.log("Lovable AI response:", content);

    // Parse the JSON content
    let parsedContent;
    try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            parsedContent = JSON.parse(jsonMatch[0]);
        } else {
            parsedContent = JSON.parse(content);
        }
    } catch (e) {
        console.error("Failed to parse JSON:", content);
        throw new Error("Invalid JSON format from AI");
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in explore-phrase function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
