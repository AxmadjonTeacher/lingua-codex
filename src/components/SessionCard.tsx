import { useState } from "react";
import { Session } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Trash2, Pencil, Check, X } from "lucide-react";
import { Link } from "react-router-dom";

interface SessionCardProps {
  session: Session;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
}

export function SessionCard({ session, onDelete, onUpdateTitle }: SessionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);

  const thumbnailUrl = `https://img.youtube.com/vi/${session.youtubeId}/mqdefault.jpg`;
  const hasNotes = session.notes.trim().length > 0;
  const notesPreview = hasNotes 
    ? session.notes.slice(0, 50) + (session.notes.length > 50 ? "..." : "")
    : "No notes taken yet...";

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      onUpdateTitle(session.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(session.title);
    setIsEditing(false);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/session/${session.id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={session.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") handleCancelEdit();
              }}
              className="h-8 text-sm"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={handleSaveTitle} className="h-8 w-8 text-primary">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancelEdit} className="h-8 w-8 text-muted-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to={`/session/${session.id}`} className="flex-1">
              <h3 className="font-semibold text-foreground hover:text-primary line-clamp-1">
                {session.title}
              </h3>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )}
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
          {notesPreview}
        </p>
        
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>{session.phrases.length} phrases</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(session.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to={`/session/${session.id}`}>
                Review
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
