// BloqEditor.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useMyPresence, useOthers, useStatus } from "@liveblocks/react";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import Theme from "./plugins/ThemePlugin";
import { liveblocksConfig, LiveblocksPlugin } from "@liveblocks/react-lexical";

function Placeholder() {
  return <div className="text-muted-foreground text-sm"></div>;
}

interface BloqEditorProps {
  bloqId: string;
  isEditable?: boolean;
}

export function BloqEditor({ bloqId, isEditable = true }: BloqEditorProps) {
  const [loaded, setLoaded] = useState(false);
  const [, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const status = useStatus();
  const handleFocus = useCallback(() => {
    updateMyPresence({ activeBloqId: bloqId });
  }, [bloqId, updateMyPresence]);
  const handleBlur = useCallback(() => {
    updateMyPresence({ activeBloqId: null });
  }, [updateMyPresence]);
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (status !== "connected") {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Connecting collaborative editor...
      </div>
    );
  }

  const initialConfig = liveblocksConfig({
    namespace: `BloqEditor-${bloqId}`,
    theme: Theme,
    nodes: [HeadingNode, QuoteNode],
    onError(error: Error) {
      console.error(error);
    },
    editable: isEditable,
  });

  // Get users currently editing this bloq
  const usersInThisBloq = others.filter(
    (other) => other.presence?.activeBloqId === bloqId
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="w-full bg-card rounded-2xl shadow-lg overflow-hidden">
        {isEditable && (
          <div className="border-b border-border bg-surface px-4 py-2">
            <ToolbarPlugin />
          </div>
        )}
        <div
          className="relative bg-background/50 backdrop-blur-sm p-4"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {!loaded ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="min-h-[200px] prose prose-slate prose-headings:font-semibold prose-p:text-foreground max-w-none">
              <LiveblocksPlugin />
              <RichTextPlugin
                contentEditable={<ContentEditable className="outline-none" />}
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
            </div>
          )}

          {/* Show users currently editing this bloq */}
          {usersInThisBloq.length > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1">
              {usersInThisBloq.map((user) => (
                <div
                  key={user.connectionId}
                  className="w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-white text-xs font-medium shadow-md"
                  style={{
                    backgroundColor: user.presence?.user?.color || "#6B4CE6",
                  }}
                  title={user.presence?.user?.name || "Unknown"}
                >
                  {(user.presence?.user?.name || "U").charAt(0)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}
