import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Thread {
  id: string;
  title: string;
  createdAt: Date;
  lastMessage?: string;
}

interface ThreadSidebarProps {
  threads: Thread[];
  activeThreadId: string;
  onThreadSelect: (threadId: string) => void;
  onNewThread: () => void;
  onDeleteThread: (threadId: string) => void;
}

export const ThreadSidebar = ({ 
  threads, 
  activeThreadId, 
  onThreadSelect, 
  onNewThread,
  onDeleteThread 
}: ThreadSidebarProps) => {
  const [hoveredThread, setHoveredThread] = useState<string | null>(null);

  const truncateTitle = (title: string, maxLength = 30) => {
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };

  return (
    <Sidebar className="border-r border-border bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Threads</h2>
          <SidebarTrigger />
        </div>
        <Button 
          onClick={onNewThread}
          className="w-full mt-3 bg-gradient-primary hover:bg-gradient-secondary transition-smooth shadow-glow gap-2"
        >
          <Plus className="w-4 h-4" />
          New Thread
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {threads.map((thread) => (
            <SidebarMenuItem key={thread.id}>
              <SidebarMenuButton
                className={cn(
                  "w-full p-3 rounded-lg border transition-smooth group relative",
                  activeThreadId === thread.id
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-transparent border-border hover:bg-accent/50 hover:border-accent"
                )}
                onClick={() => onThreadSelect(thread.id)}
                onMouseEnter={() => setHoveredThread(thread.id)}
                onMouseLeave={() => setHoveredThread(null)}
              >
                <div className="flex items-start gap-3 w-full">
                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {truncateTitle(thread.title)}
                    </div>
                    {thread.lastMessage && (
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {truncateTitle(thread.lastMessage, 40)}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {thread.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  {hoveredThread === thread.id && threads.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteThread(thread.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          {threads.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No threads yet</p>
              <p className="text-xs text-muted-foreground">Start a new conversation</p>
            </div>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};