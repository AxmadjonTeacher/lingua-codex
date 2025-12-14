import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { explorePhrase } from "@/lib/geminiService";
import { ExplorationResult } from "@/types";
import { Search, Sparkles, Loader2, Cloud } from "lucide-react";
import { toast } from "sonner";

export default function ExploreView() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ExplorationResult | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const data = await explorePhrase(query);
            setResult(data);
        } catch (error) {
            toast.error("Failed to explore phrase. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="container mx-auto max-w-5xl flex-1 px-4 py-8">
                <div className="mb-8 text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
                        <span className="text-orange-500">Explore</span> Culture & Context
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Go beyond definitions. Understand how phrases feel and function in real conversations.
                    </p>
                </div>

                {/* Search Experience */}
                <div className="max-w-2xl mx-auto mb-12 relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${loading ? 'animate-pulse' : ''}`}></div>
                    <div className="relative flex gap-2 p-2 bg-background rounded-lg border shadow-sm">
                        <Input
                            className="border-0 shadow-none focus-visible:ring-0 text-lg px-4"
                            placeholder="Type a phrase e.g. 'Break the ice'..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                        <Button
                            onClick={handleSearch}
                            className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Search className="mr-2 h-5 w-5" /> Explore</>}
                        </Button>
                    </div>
                </div>

                {/* Results Layout */}
                {result ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Definition Card */}
                        <Card className="border-t-4 border-t-orange-500 shadow-md transform hover:-translate-y-1 transition-transform duration-300">
                            <CardHeader>
                                <CardTitle className="text-2xl font-serif italic text-foreground">"{result.phrase}"</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xl text-foreground font-medium mb-4">{result.explanation}</p>

                                {/* Daily Life Highlight */}
                                <div className="bg-orange-50/50 dark:bg-orange-950/20 p-6 rounded-r-lg border-l-8 border-orange-500 ml-0 flex flex-col gap-2">
                                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Example</span>
                                    <p className="text-lg font-medium text-foreground">"{result.simpleExample.sentence}"</p>
                                    <p className="text-muted-foreground italic">— {result.simpleExample.explanation}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Scenario Grid */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"> <Sparkles className="h-5 w-5 text-orange-500" /> Real-life Scenarios</h3>
                            <div className="grid gap-6 md:grid-cols-3">
                                {result.scenarios.map((scenario, index) => (
                                    <Card key={index} className="hover:border-orange-200 dark:hover:border-orange-800 transition-colors cursor-default group h-full flex flex-col">
                                        <CardHeader className="pb-3">
                                            <div className="inline-block px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-semibold mb-2">
                                                {scenario.context}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col">
                                            <p className="font-medium text-foreground mb-3 flex-1">
                                                <span className="mr-2">👉</span>
                                                {scenario.sentence}
                                            </p>
                                            <p className="text-sm text-muted-foreground border-t pt-3 mt-auto">
                                                {scenario.explanation}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    !loading && (
                        <div className="text-center py-20 opacity-50 select-none">
                            <Cloud className="h-24 w-24 mx-auto text-muted-foreground mb-4" strokeWidth={1} />
                            <p className="text-xl text-muted-foreground font-light">Search for a phrase to discover its nuances</p>
                        </div>
                    )
                )}
            </main>

            <Footer />
        </div>
    );
}
