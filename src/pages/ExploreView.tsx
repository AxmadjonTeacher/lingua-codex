import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { explorePhrase } from "@/lib/geminiService";
import { ExplorationResult } from "@/types";
import { Search, Loader2, Cloud, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { playBrowserTTS } from "@/lib/audioService";

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

    const handlePlayAudio = (text: string) => {
        playBrowserTTS(text);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="container mx-auto max-w-4xl flex-1 px-4 py-8">
                <div className="mb-8 text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
                        <span className="text-orange-500">Explore</span> Phrases
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Enter an English phrase or word to get its meaning in Uzbek with practical examples
                    </p>
                </div>

                {/* Search Experience */}
                <div className="max-w-2xl mx-auto mb-12 relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${loading ? 'animate-pulse' : ''}`}></div>
                    <div className="relative flex gap-2 p-2 bg-background rounded-lg border shadow-sm">
                        <Input
                            className="border-0 shadow-none focus-visible:ring-0 text-lg px-4"
                            placeholder="Type a phrase e.g. 'comes at a price'..."
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
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Section 1: Meaning in Uzbek */}
                        <Card className="border-l-4 border-l-orange-500 shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-xl">1️⃣</span> Meaning in Uzbek
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-3">
                                    <p className="text-2xl font-semibold text-foreground">
                                        {result.phrase} —
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                                        onClick={() => handlePlayAudio(result.phrase)}
                                    >
                                        <Volume2 className="h-5 w-5" />
                                    </Button>
                                </div>
                                <p className="text-lg text-foreground leading-relaxed flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">👉</span>
                                    <span>{result.explanation}</span>
                                </p>
                            </CardContent>
                        </Card>

                        {/* Section 2: Simple English Example */}
                        <Card className="border-l-4 border-l-blue-500 shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-xl">2️⃣</span> Simple English Example
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <p className="text-xl font-medium text-foreground italic">
                                        "{result.simpleExample.sentence}"
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                        onClick={() => handlePlayAudio(result.simpleExample.sentence)}
                                    >
                                        <Volume2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 3: Three Common Situational Examples */}
                        <Card className="border-l-4 border-l-green-500 shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-xl">3️⃣</span> Three Common Situational Examples
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {result.scenarios.map((scenario, index) => (
                                    <div key={index} className="space-y-2">
                                        <h4 className="font-bold text-foreground">
                                            {index + 1}. {scenario.context}
                                        </h4>
                                        <div className="flex items-center gap-2 pl-4 border-l-2 border-muted">
                                            <p className="text-foreground flex-1">
                                                {scenario.sentence}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0 text-green-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                                                onClick={() => handlePlayAudio(scenario.sentence)}
                                            >
                                                <Volume2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    /* Empty State */
                    !loading && (
                        <div className="text-center py-20 opacity-50 select-none">
                            <Cloud className="h-24 w-24 mx-auto text-muted-foreground mb-4" strokeWidth={1} />
                            <p className="text-xl text-muted-foreground font-light">Search for a phrase to discover its meaning</p>
                        </div>
                    )
                )}
            </main>

            <Footer />
        </div>
    );
}
