"use client";

import React, { useState, useRef, useEffect } from "react";
import { useThreads, useCreateThread } from "@liveblocks/react/suspense";
import { Thread } from "@liveblocks/react-ui";
import { MessageCircle, Plus, X } from "lucide-react";
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
    if (!commentText.trim()) return;

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
          "flex items-center gap-2 transition-all duration-200",
          isOpen && "bg-primary text-primary-foreground shadow-md"
        )}
      >
        <MessageCircle className="w-4 h-4" />
        {unresolvedThreads.length > 0 && (
          <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
            {unresolvedThreads.length}
          </span>
        )}
      </Button>

      {/* Slide-out Comments Drawer - positioned closer to bloq */}
      {isOpen && (
        <div
          ref={commentsRef}
          data-comments-panel
          className={cn(
            "fixed top-0 right-40 w-80 max-h-[calc(100vh-2rem)] z-[9999]",
            "transform transition-all duration-300 ease-out",
            isOpen
              ? "translate-x-0 opacity-100 scale-100"
              : "translate-x-4 opacity-0 scale-95"
          )}
        >
          <Card className="h-full bg-card/95 backdrop-blur-md border-2 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">Comments</h3>
                {unresolvedThreads.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({unresolvedThreads.length})
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsCreating(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 p-0 flex items-center justify-center"
                  disabled={isCreating}
                  title="Add comment"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleComments}
                  className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive h-8 w-8 p-0 flex items-center justify-center"
                  title="Close comments"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col h-[calc(100%-73px)]">
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0">
                {isCreating && (
                  <div className="border border-primary/20 rounded-lg p-3 bg-primary/5">
                    <div className="mb-3">
                      <textarea
                        placeholder="Write your comment..."
                        className="w-full min-h-[80px] p-3 text-sm bg-background border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateComment}
                        className="flex-1 h-9"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Comment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreating(false);
                          setCommentText("");
                        }}
                        className="h-9"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {unresolvedThreads.length === 0 && !isCreating ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-3">
                      <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      No comments yet
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Click the + button to start a discussion
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {unresolvedThreads.map((thread) => (
                      <div
                        key={thread.id}
                        className="thread-container border border-border rounded-lg overflow-hidden bg-background"
                      >
                        <Thread
                          thread={thread}
                          className="lb-thread-custom max-w-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
