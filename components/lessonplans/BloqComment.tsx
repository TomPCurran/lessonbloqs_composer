"use client";

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import ReactDOM from "react-dom";
import { useThreads, useCreateThread } from "@liveblocks/react/suspense";
import { Thread, Composer } from "@liveblocks/react-ui";
import { MessageCircle, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { sendCommentMention } from "@/lib/actions/room.actions";

// Global state for managing open comment panels
const CommentPanelContext = createContext<{
  openBloqId: string | null;
  setOpenBloqId: (bloqId: string | null) => void;
}>({
  openBloqId: null,
  setOpenBloqId: () => {},
});

export const useCommentPanel = () => useContext(CommentPanelContext);

export const CommentPanelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openBloqId, setOpenBloqId] = useState<string | null>(null);

  return (
    <CommentPanelContext.Provider value={{ openBloqId, setOpenBloqId }}>
      {children}
    </CommentPanelContext.Provider>
  );
};

interface BloqCommentsProps {
  bloqId: string;
  bloqRef: React.RefObject<HTMLDivElement | null>;
}

// Helper function to extract mentions from comment body
const extractMentions = (body: any): string[] => {
  const mentions: string[] = [];

  if (!body?.content) return mentions;

  const traverseContent = (content: any[]) => {
    content.forEach((block: any) => {
      if (block.type === "mention" && block.attrs?.id) {
        mentions.push(block.attrs.id);
      }
      if (block.content) {
        traverseContent(block.content);
      }
    });
  };

  traverseContent(body.content);
  return [...new Set(mentions)]; // Remove duplicates
};

// Helper function to extract plain text from comment body
const extractPlainText = (body: any): string => {
  if (!body?.content) return "";

  const extractText = (content: any[]): string => {
    return content
      .map((block: any) => {
        if (block.type === "text") {
          return block.text || "";
        }
        if (block.type === "mention" && block.attrs?.id) {
          return `@${block.attrs.id}`;
        }
        if (block.content) {
          return extractText(block.content);
        }
        return "";
      })
      .join("");
  };

  return extractText(body.content);
};

export function BloqComments({ bloqId, bloqRef }: BloqCommentsProps) {
  console.log("💬 [BloqComment] Rendering BloqComments", { bloqId });

  const { openBloqId, setOpenBloqId } = useCommentPanel();
  const isOpen = openBloqId === bloqId;
  const [isCreating, setIsCreating] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const room = useRoom();

  const [panelPosition, setPanelPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get all threads for this specific bloq
  const { threads } = useThreads({
    query: {
      metadata: {
        bloqId,
      },
    },
  });
  const createThread = useCreateThread();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        commentsRef.current?.contains(target) ||
        (target as HTMLElement).closest('[role="menu"]') ||
        bloqRef.current?.contains(target)
      ) {
        return;
      }

      setOpenBloqId(null);
      if (isCreating) {
        setIsCreating(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isCreating, setOpenBloqId, bloqRef]);

  // Calculate panel position on open
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          const panelWidth = 600;
          const margin = 16;
          const viewportWidth = window.innerWidth;
          let left = buttonRect.right + margin;
          let top = buttonRect.top + window.scrollY;

          if (left + panelWidth > viewportWidth) {
            left = buttonRect.left - panelWidth - margin;
          }

          top = Math.max(
            16 + window.scrollY,
            Math.min(top, window.scrollY + window.innerHeight - 400)
          );
          setPanelPosition({ top, left });
        }
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
    if (!isOpen) {
      setPanelPosition(null);
    }
  }, [isOpen]);

  const handleCreateComment = async (body: any) => {
    if (!user) return;

    // Create the thread first
    createThread({
      body,
      metadata: {
        bloqId,
        type: "comment",
        resolved: false,
        authorName: `${user.firstName} ${user.lastName}`,
        authorEmail: user.emailAddresses[0]?.emailAddress,
        authorImage: user.imageUrl,
      },
    });

    // Extract mentions and send notifications
    const mentionedUserIds = extractMentions(body);
    const commentText = extractPlainText(body);

    if (mentionedUserIds.length > 0) {
      console.log("💬 [BloqComment] Found mentions:", mentionedUserIds);

      // Send mention notifications to each mentioned user
      for (const mentionedUserId of mentionedUserIds) {
        try {
          await sendCommentMention({
            roomId: room.id,
            mentionedUserId,
            comment: commentText,
            mentionedBy: {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.emailAddresses[0]?.emailAddress || "",
              avatar: user.imageUrl,
              color: "", // This field might not be needed for notifications
            },
            bloqId,
          });
          console.log(
            "💬 [BloqComment] Mention notification sent to:",
            mentionedUserId
          );
        } catch (error) {
          console.error(
            "💬 [BloqComment] Error sending mention notification:",
            error
          );
        }
      }
    }

    setIsCreating(false);
  };

  const toggleComments = () => {
    console.log("💬 [BloqComment] Toggle comments", { bloqId, isOpen });
    if (isOpen) {
      setOpenBloqId(null);
      if (isCreating) {
        setIsCreating(false);
      }
    } else {
      setOpenBloqId(bloqId);
    }
  };

  const unresolvedThreads = threads.filter(
    (thread) => !thread.metadata.resolved
  );

  return (
    <>
      {/* Comments Toggle Button */}
      <Button
        ref={buttonRef}
        variant="outline"
        size="sm"
        onClick={toggleComments}
        data-comments-toggle
        className={cn(
          "google-button-ghost h-8 w-8 p-0 relative",
          "hover:bg-accent/10 hover:text-accent transition-all duration-200",
          isOpen && "bg-accent/15 text-accent"
        )}
      >
        <MessageCircle className="w-4 h-4" />
        {unresolvedThreads.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
            {unresolvedThreads.length}
          </div>
        )}
      </Button>

      {/* Comments Panel in Portal */}
      {isOpen && panelPosition && typeof window !== "undefined"
        ? ReactDOM.createPortal(
            <div
              ref={commentsRef}
              data-comments-panel
              style={{
                position: "absolute",
                top: panelPosition.top,
                left: panelPosition.left,
                width: 600,
                maxHeight: "calc(100vh - 6rem)",
                zIndex: 9999,
              }}
              className={cn("animate-slide-in")}
            >
              <Card
                className={cn(
                  "glass h-full border border-border/50 elevation-4",
                  "bg-surface/98 backdrop-blur-md relative z-[100]"
                )}
              >
                {/* Header */}
                <div className="google-surface p-grid-3 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-grid-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-label-large text-foreground">
                          Block Comments
                        </h3>
                        <p className="text-body-small text-muted-foreground">
                          {unresolvedThreads.length} active discussion
                          {unresolvedThreads.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-grid-1">
                      <Button
                        onClick={() => setIsCreating(true)}
                        disabled={isCreating}
                        className="google-button-primary h-8 w-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={toggleComments}
                        className="google-button-ghost h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col h-[calc(100%-5rem)]">
                  <div className="flex-1 p-grid-3 overflow-y-auto space-grid-3 min-h-0">
                    {/* Comment Creation with Liveblocks Composer */}
                    {isCreating && (
                      <div className="google-card p-grid-3 border-primary/30 bg-primary/5 animate-fade-in">
                        <div className="space-grid-2">
                          <label className="text-label-medium text-foreground">
                            Add Comment
                          </label>
                          <div className="min-h-[100px]">
                            <Composer
                              onComposerSubmit={({ body }) => {
                                handleCreateComment(body);
                              }}
                              autoFocus
                              placeholder="Share your thoughts... (Type @ to mention someone)"
                              className="lb-composer-custom"
                            />
                          </div>
                          <div className="flex gap-grid-2">
                            <Button
                              onClick={() => setIsCreating(false)}
                              className="google-button-secondary"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* List of all threads */}
                    {unresolvedThreads.length > 0
                      ? unresolvedThreads.map((thread) => (
                          <Thread
                            key={thread.id}
                            thread={thread}
                            showActions={true}
                            className="lb-thread-custom"
                          />
                        ))
                      : !isCreating && (
                          <div className="text-center text-muted-foreground p-8 text-body-medium">
                            No comments on this block yet.
                          </div>
                        )}
                  </div>
                </div>
              </Card>
            </div>,
            document.body
          )
        : null}

      {/* CSS for Liveblocks components */}
      <style jsx global>{`
        .lb-popover,
        .lb-dropdown,
        [data-radix-popper-content-wrapper],
        [role="menu"],
        .lb-thread [role="menu"],
        .lb-comment [role="menu"] {
          z-index: 150 !important;
        }

        [data-comments-panel] {
          z-index: 100 !important;
        }

        .lb-thread-custom {
          overflow: visible !important;
        }

        .lb-thread {
          overflow: visible !important;
        }

        .lb-thread[data-resolved="true"] {
          opacity: 0.6;
          transition: opacity 0.2s ease-in-out;
        }

        .lb-thread[data-resolved="true"] .lb-composer {
          display: none;
        }

        .lb-composer-custom .lb-composer-editor {
          min-height: 80px;
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          padding: 0.75rem;
          font-size: 0.875rem;
        }

        .lb-composer-custom .lb-composer-editor:focus {
          outline: none;
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }

        .lb-composer-suggestions {
          z-index: 200 !important;
        }
      `}</style>
    </>
  );
}
