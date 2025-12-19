import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import SessionPage from "./pages/SessionPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyPhrases from "./pages/MyPhrases";
import OnlineLessons from "./pages/OnlineLessons";
import LessonViewer from "./pages/LessonViewer";
import NotFound from "./pages/NotFound";
import ExploreView from "./pages/ExploreView";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-phrases" element={<MyPhrases />} />
            <Route path="/online-lessons" element={<OnlineLessons />} />
            <Route path="/lesson/:id" element={<LessonViewer />} />
            <Route path="/session/:id" element={<SessionPage />} />
            <Route path="/explore" element={<ExploreView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
