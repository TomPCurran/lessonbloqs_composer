// BloqEditor.tsx
"use client";

import React, { useEffect, useState } from "react";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import ToolbarPlugin from "./plugins/ToolbarPlugin";
import Theme from "./plugins/ThemePlugin";

function Placeholder() {
  return <div className="text-muted-foreground text-sm"></div>;
}

interface BloqEditorProps {
  onUpdate: (updates: { content?: string }) => void;
  isEditable?: boolean;
}

export function BloqEditor({ onUpdate, isEditable = true }: BloqEditorProps) {
  const [loaded, setLoaded] = useState(false);

  const initialConfig = {
    namespace: "BloqEditor",
    theme: Theme,
    nodes: [HeadingNode, QuoteNode],
    onError(error: Error) {
      console.error(error);
    },
    editable: isEditable,
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="w-full bg-card rounded-2xl shadow-lg overflow-hidden">
        {isEditable && (
          <div className="border-b border-border bg-surface px-4 py-2">
            <ToolbarPlugin />
          </div>
        )}
        <div className="relative bg-background/50 backdrop-blur-sm p-4">
          {!loaded ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="min-h-[200px] prose prose-slate prose-headings:font-semibold prose-p:text-foreground max-w-none">
              <RichTextPlugin
                contentEditable={<ContentEditable className="outline-none" />}
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {/* {isEditable && <FloatingToolbarPlugin />}
              <OnChangePlugin onChange={handleChange} />
              <HistoryPlugin />
              <AutoFocusPlugin /> */}
            </div>
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}
