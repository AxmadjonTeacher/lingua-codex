import { supabase } from "@/integrations/supabase/client";
import { ExplorationResult } from "@/types";

export async function explorePhrase(phrase: string): Promise<ExplorationResult> {
    try {
        const { data, error } = await supabase.functions.invoke('explore-phrase', {
            body: { phrase },
        });

        if (error) {
            console.error("Edge function error:", error);
            throw new Error("Failed to explore phrase");
        }

        if (data.error) {
            console.error("Gemini API error:", data.error);
            throw new Error(data.error);
        }

        return {
            phrase,
            ...data
        };
    } catch (error) {
        console.error("Gemini Explore API error:", error);
        throw error;
    }
}
