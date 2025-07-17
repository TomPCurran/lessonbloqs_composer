"use client";

import React, { useState, useRef, useEffect } from "react";
import { useThreads, useCreateThread } from "@liveblocks/react/suspense";
import { Thread } from "@liveblocks/react-ui";
import { MessageCircle, Plus, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BloqCommentsProps {
  bloqId: string;
}

export function BloqComments({ bloqId }: BloqCommentsProps) {
  console.log("[BloqComment] render", { bloqId });
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [commentText, setCommentText] = useState("");
  const commentsRef = useRef<HTMLDivElement>(null);

  // Get all threads for this specific bloq
  const { threads } = useThreads({
    query: {
      metadata: {
        bloqId,
      },
    },
  });

  const createThread = useCreateThread();

  // Handle clicks outside the comments panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commentsRef.current &&
        !commentsRef.current.contains(event.target as Node)
      ) {
        // Don't close if clicking on the comments toggle button
        const target = event.target as HTMLElement;
        if (target.closest("[data-comments-toggle]")) {
          return;
        }
        // Don't close if clicking on the comments panel itself
        if (target.closest("[data-comments-panel]")) {
          return;
        }
        setIsOpen(false);
        if (isCreating) {
          setIsCreating(false);
          setCommentText("");
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isCreating]);

  const handleCreateComment = () => {
    if (!commentText.trim() || !user) return;

    createThread({
      body: {
        version: 1,
        content: [
          { type: "paragraph", children: [{ text: commentText.trim() }] },
        ],
      },
      metadata: {
        bloqId,
        type: "comment",
        resolved: false,
        authorName: `${user.firstName} ${user.lastName}`,
        authorEmail: user.emailAddresses[0]?.emailAddress,
        authorImage: user.imageUrl,
      },
    });

    setCommentText("");
    setIsCreating(false);
  };

  const toggleComments = () => {
    setIsOpen(!isOpen);
    if (isCreating) {
      setIsCreating(false);
      setCommentText("");
    }
  };

  const unresolvedThreads = threads.filter(
    (thread) => !thread.metadata.resolved
  );

  return (
    <>
      {/* Comments Toggle Button */}
      <Button
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

      {/* Comments Drawer */}
      {isOpen && (
        <div
          ref={commentsRef}
          data-comments-panel
          className={cn(
            "fixed top-20 right-1 w-72 max-h-[calc(100vh-6rem)] z-[100]",
            "animate-slide-in"
          )}
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
                {/* Comment Creation */}
                {isCreating && (
                  <div className="google-card p-grid-3 border-primary/30 bg-primary/5 animate-fade-in">
                    <div className="space-grid-2">
                      <label className="text-label-medium text-foreground">
                        Add Comment
                      </label>
                      <textarea
                        placeholder="Share your thoughts..."
                        className="google-input min-h-[80px] resize-none text-body-medium"
                        autoFocus
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleCreateComment();
                          }
                        }}
                      />
                      <div className="flex gap-grid-2">
                        <Button
                          onClick={handleCreateComment}
                          disabled={!commentText.trim()}
                          className="google-button-primary flex-1"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </Button>
                        <Button
                          onClick={() => {
                            setIsCreating(false);
                            setCommentText("");
                          }}
                          className="google-button-secondary"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {unresolvedThreads.length === 0 && !isCreating && (
                  <div className="google-card p-grid-6 text-center animate-fade-in">
                    <div className="space-grid-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-accent" />
                      </div>
                      <div className="space-grid-1">
                        <h4 className="text-headline-small text-foreground">
                          No comments yet
                        </h4>
                        <p className="text-body-medium text-muted-foreground">
                          Start a discussion about this content block
                        </p>
                      </div>
                      <Button
                        onClick={() => setIsCreating(true)}
                        className="google-button-primary mx-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Comment
                      </Button>
                    </div>
                  </div>
                )}

                {/* Thread List */}
                {unresolvedThreads.length > 0 && (
                  <div className="space-grid-3">
                    {unresolvedThreads.map((thread, index) => (
                      <div
                        key={thread.id}
                        className="google-card overflow-visible animate-fade-in relative"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative z-[110]">
                          <Thread
                            thread={thread}
                            className="lb-thread-custom"
                            showActions={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="google-surface p-grid-3 border-t border-border/50">
                <div className="flex items-center justify-between text-body-small text-muted-foreground">
                  <span>Block discussions</span>
                  <span>{unresolvedThreads.length} active</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* CSS for Liveblocks thread menus */}
      <style jsx global>{`
        /* Ensure Liveblocks menus appear above comment panel */
        .lb-popover,
        .lb-dropdown,
        [data-radix-popper-content-wrapper],
        [role="menu"],
        .lb-thread [role="menu"],
        .lb-comment [role="menu"] {
          z-index: 150 !important;
          position: fixed !important;
        }

        /* Keep comment panel visible when menus open */
        [data-comments-panel] {
          z-index: 100 !important;
        }

        /* Reduce button sizes in comments */
        .lb-comment-actions button {
          width: 24px !important;
          height: 24px !important;
          padding: 2px !important;
          font-size: 12px !important;
        }

        .lb-thread-custom {
          overflow: visible !important;
        }

        .lb-thread {
          overflow: visible !important;
        }

        /* Make sure comment content has space */
        .lb-comment-body {
          margin-right: 80px !important;
        }

        /* Position action buttons better */
        .lb-comment-actions {
          z-index: 155 !important;
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
        }
      `}</style>
    </>
  );
}
