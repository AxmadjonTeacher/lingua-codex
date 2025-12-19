import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { User as UserIcon, Mail, Gamepad2, Mic, Video, Menu, Columns, Presentation, Moon, Sun } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { migrateLocalSessions } from "@/lib/storage";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        // Force re-render on user update events
        if (event === 'USER_UPDATED') {
          setUser({ ...session!.user });
        }
        // Migrate local sessions when user logs in
        if (session?.user) {
          setTimeout(() => {
            migrateLocalSessions();
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span className="text-sm font-medium">Dark Mode</span>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>

                <div className="relative">
                  <Button variant="outline" size="sm" disabled className="w-full justify-start gap-2 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                    <Columns className="h-4 w-4" />
                    Side by Side
                  </Button>
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10 border border-white leading-none">
                    SOON
                  </span>
                </div>

                <a href="https://alwhiteboard.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-700 border-emerald-200 hover:border-emerald-300 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200 dark:border-emerald-800 dark:hover:border-emerald-700">
                    <Presentation className="h-4 w-4" />
                    White board
                  </Button>
                </a>

                <div className="relative">
                  <Button variant="outline" size="sm" disabled className="w-full justify-start gap-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
                    <Gamepad2 className="h-4 w-4" />
                    Fun & Games
                  </Button>
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10 border border-white leading-none">
                    SOON
                  </span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
              L
            </div>
            <span className="text-lg font-semibold text-foreground">
              Lingua Codex
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">


          <a href="https://app.sesame.com/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-700 border-sky-200 hover:border-sky-300 dark:bg-sky-950 dark:hover:bg-sky-900 dark:text-sky-300 dark:hover:text-sky-200 dark:border-sky-800 dark:hover:border-sky-700">
              <Mic className="h-4 w-4" />
              Speaking
            </Button>
          </a>

          <div className="relative">
            <Button variant="outline" size="sm" disabled className="gap-2 bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800">
              <Video className="h-4 w-4" />
              Online Lessons
            </Button>
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10 border border-white leading-none">
              SOON
            </span>
          </div>


          {user ? (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/profile")}>
              <UserIcon className="h-4 w-4" />
              {user.user_metadata?.full_name || "Profile"}
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/auth")}>
              <Mail className="h-4 w-4" />
              Email
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
