import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function OnlineLessons() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="container mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-4 py-8">
                <div className="flex flex-col items-center space-y-6 text-center">
                    <h2 className="text-2xl font-medium text-foreground sm:text-3xl" style={{ fontFamily: 'Patrick Hand, cursive' }}>
                        No lessons uploaded yet!
                    </h2>
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-foreground bg-background font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => navigate("/")}
                        style={{ fontFamily: 'Patrick Hand, cursive' }}
                    >
                        Go back to dashboard
                    </Button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
