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
            content: `You are a "Cultural & Contextual Guide" for the Uzbek language. 
Your goal is to explain how a phrase feels and functions in real-life conversations.
Output EVERYTHING in JSON format.
Detailed Instructions:
1.  **Friendly & Emoji-led**: Be approachable and use emojis.
2.  **Uzbek Meta-data**: The 'explanation' and 'scenarios[].explanation' MUST be in Uzbek.
3.  **Target Language Content**: The 'simpleExample.sentence' and 'scenarios[].sentence' should be in the target language (usually English, based on input) or the language of the phrase being explored, but the context/explanation is ALWAYS Uzbek.
4.  **Real-life Scenarios**: Provide 3 distinct scenarios (e.g., At Work, With Friends, Formal).`
          },
          {
            role: 'user',
            content: `Explore the phrase: "${phrase}".
            
Return structured JSON matching this schema:
{
  "explanation": "General meaning and nuance of the phrase (in Uzbek)",
  "simpleExample": {
    "sentence": "A simple sentence using the phrase",
    "explanation": "What this specific sentence means (in Uzbek)"
  },
  "scenarios": [
    {
      "context": "Context title e.g. 'Ishda' (At work) (in Uzbek)",
      "sentence": "Natural usage sentence",
      "explanation": "Nuance explanation (in Uzbek)"
    },
    { "context": "...", "sentence": "...", "explanation": "..." },
    { "context": "...", "sentence": "...", "explanation": "..." }
  ]
}`
          }
        ],
        response_format: {
            type: "json_object",
            schema: {
                type: "object",
                properties: {
                    explanation: { type: "string" },
                    simpleExample: {
                        type: "object",
                        properties: {
                            sentence: { type: "string" },
                            explanation: { type: "string" }
                        }
                    },
                    scenarios: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                context: { type: "string" },
                                sentence: { type: "string" },
                                explanation: { type: "string" }
                            }
                        }
                    }
                }
            }
        }
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

    // Parse the JSON content directly as we requested structured output
    let parsedContent;
    try {
        parsedContent = JSON.parse(content);
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
