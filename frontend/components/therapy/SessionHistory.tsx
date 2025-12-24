'use client';

import {
  MessageSquare,
  Clock,
  Calendar,
  Search,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getSessionsHistory, createSession, Session } from "@/lib/api/sessions";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type SessionHistoryProps = {
  currentSessionId?: string;
  onToggle?: () => void;
  onNewSession?: () => Promise<void>;
};

export default function SessionHistory({
  currentSessionId,
  onToggle,
  onNewSession,
}: SessionHistoryProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user._id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadSessions();
    }
  }, [userId]);

  const loadSessions = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const data = await getSessionsHistory(userId);
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = async () => {
    if (!userId) return;
    
    try {
      const newSession = await createSession(userId);
      router.push(`/therapy/${newSession._id}`);
      if (onNewSession) {
        await onNewSession();
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const getSessionTitle = (session: Session): string => {
    if (session.title && session.title !== 'Nouvelle session') {
      return session.title;
    }
    
    // Generate title from first message or use date
    if (session.messages && session.messages.length > 0) {
      const firstUserMessage = session.messages.find(m => m.role === 'user');
      if (firstUserMessage) {
        return firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
      }
    }
    
    return `Session du ${new Date(session.startedAt).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })}`;
  };

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = getSessionTitle(session).toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || session.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Group sessions by date
  const groupSessionsByDate = (sessions: Session[]) => {
    const groups: Record<string, Session[]> = {};
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.startedAt);
      const now = new Date();
      const diffTime = now.getTime() - sessionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      let groupKey: string;
      if (diffDays === 0) {
        groupKey = "Today";
      } else if (diffDays === 1) {
        groupKey = "Yesterday";
      } else if (diffDays < 7) {
        groupKey = "This Week";
      } else if (diffDays < 30) {
        groupKey = "This Month";
      } else if (diffDays < 90) {
        groupKey = "Last 3 Months";
      } else {
        groupKey = "Older";
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(session);
    });
    
    return groups;
  };

  const filteredGroups = groupSessionsByDate(filteredSessions);

  const formatGroupDate = (group: string) => {
    const groupOrder = ["Today", "Yesterday", "This Week", "This Month", "Last 3 Months", "Older"];
    return group;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-3 border-b border-violet-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2 text-gray-900">
            <Calendar className="w-4 h-4 text-violet-600" />
            <span>Session History</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="gap-2 text-gray-700 hover:text-gray-900 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <Button
          variant="default"
          className="w-full justify-start gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
          onClick={handleNewSession}
        >
          <MessageSquare className="w-4 h-4" />
          New Session
        </Button>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white border-gray-200 focus:border-violet-500 focus:ring-violet-500"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "active", "completed"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 capitalize",
                filter === f 
                  ? "bg-violet-600 hover:bg-violet-700 text-white" 
                  : "text-gray-700 hover:bg-white/50"
              )}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1.5">
        {isLoading ? (
          <LoadingSpinner />
        ) : Object.keys(filteredGroups).length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <AnimatePresence>
            {Object.entries(filteredGroups).map(([date, sessions]) => (
              <div key={date} className="mb-4">
                <div className="px-3 py-1.5 text-xs font-medium text-gray-500">
                  {formatGroupDate(date)}
                </div>
                {sessions.map((session) => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    isActive={session._id === currentSessionId}
                    onClick={() => router.push(`/therapy/${session._id}`)}
                    getSessionTitle={getSessionTitle}
                  />
                ))}
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function SessionCard({
  session,
  isActive,
  onClick,
  getSessionTitle,
}: {
  session: Session;
  isActive: boolean;
  onClick: () => void;
  getSessionTitle: (session: Session) => string;
}) {
  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: fr 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left h-auto py-2.5 px-3 mb-0.5 relative",
          "hover:bg-white/60 hover:shadow-md",
          isActive && "bg-violet-50 border border-violet-200 shadow-md"
        )}
        onClick={onClick}
      >
        <div className="flex flex-col gap-1 w-full items-start overflow-hidden">
          <div className="flex items-center gap-2 w-full">
            <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-600">
              {formatDate(session.startedAt)}
            </span>
            {session.status === "active" && (
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                Active
              </span>
            )}
          </div>
          <span className="text-sm font-medium truncate w-full text-gray-900">
            {getSessionTitle(session)}
          </span>
          {session.summary && (
            <div className="text-xs text-gray-600 line-clamp-1 text-left w-full prose prose-sm dark:prose-invert">
              <ReactMarkdown>{session.summary}</ReactMarkdown>
            </div>
          )}
          {session.status === "active" && (
            <div className="absolute right-2 top-2.5 w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </div>
      </Button>
    </motion.div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
    </div>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {searchQuery ? (
        <p>No sessions found matching "{searchQuery}"</p>
      ) : (
        <>
          <p>No sessions yet</p>
          <p className="text-sm">Start a new session to begin</p>
        </>
      )}
    </div>
  );
}
