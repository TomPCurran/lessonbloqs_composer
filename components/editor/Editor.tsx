"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useYjs } from "@/lib/providers/yjsProvider";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";
import { FileText, Eye } from "lucide-react";
import { useTheme } from "@/lib/providers/theme-provider"; // Import your theme hook
import { usePreferencesStore } from "@/lib/stores/preferencesStore";
import { useAppStore } from "@/lib/stores/appStore";
import { useMutation, useStorage } from "@liveblocks/react";

interface EditorProps {
  bloqId: string;
  userName: string;
  userColor: string;
  userId: string; // Add userId prop for consistent user identification
  initialContent?: string;
  canEdit: boolean;
}
// Material Design Loading State
const EditorLoadingState = () => (
  <div className="min-h-[150px] flex items-center justify-center space-grid-3">
    <div className="text-center space-grid-2">
      <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
        <FileText className="w-6 h-6 text-primary animate-pulse" />
      </div>
      <div className="space-grid-1">
        <div className="h-2 bg-muted rounded w-24 mx-auto animate-pulse" />
        <p className="text-body-small text-muted-foreground">
          Loading editor...
        </p>
      </div>
    </div>
  </div>
);

export function Editor({
  bloqId,
  userName,
  userColor,
  userId, // Add userId parameter
  initialContent,
  canEdit,
}: EditorProps) {
  const yjsContext = useYjs();
  const doc = yjsContext?.doc;
  const provider = yjsContext?.provider;
  const { theme } = useTheme();
  const editorSettings = usePreferencesStore((state) => state.editorSettings);
  const setGlobalLoading = useAppStore((s) => s.setGlobalLoading);

  // Get bloqs from storage to access content
  const bloqs = useStorage((root) => root.bloqs);
  const currentBloq = bloqs?.find((b) => b.id === bloqId);

  // Mutation to update bloq content in Liveblocks storage
  const updateBloqContent = useMutation(
    ({ storage }, bloqId: string, content: string) => {
      const bloqs = storage.get("bloqs");
      if (!bloqs) return;

      const bloqIndex = bloqs.findIndex((b) => b.get("id") === bloqId);
      if (bloqIndex !== -1) {
        const bloq = bloqs.get(bloqIndex);
        if (bloq) {
          bloq.update({
            content,
            updatedAt: Date.now(),
          });
        }
      }
    },
    []
  );

  React.useEffect(() => {
    if (!provider || !doc) {
      setGlobalLoading(true, "Loading editor...");
    } else {
      setGlobalLoading(false, "");
    }
    return () => setGlobalLoading(false, "");
  }, [provider, doc, setGlobalLoading]);

  // Use consistent user ID and color for all editors
  const initialUser = useRef({
    id: userId, // Use the actual user ID for consistent identification
    name: userName,
    color: userColor, // Use the color passed from props
  });

  const editor = useCreateBlockNote({
    collaboration:
      provider && doc
        ? {
            provider,
            fragment: doc.getXmlFragment(`blocknote-${bloqId}`),
            user: initialUser.current, // Only set once
          }
        : undefined,
    initialContent:
      (!provider || !doc) && initialContent
        ? JSON.parse(initialContent)
        : undefined,
    placeholders: {
      paragraph: "",
    },
  });

  // Sync Yjs content to Liveblocks storage
  useEffect(() => {
    if (!editor || !doc) return;

    const fragment = doc.getXmlFragment(`blocknote-${bloqId}`);

    // Function to sync content to Liveblocks
    const syncContentToLiveblocks = () => {
      try {
        // Get the content from the Yjs fragment
        const content = fragment.toString();

        // Only update if content is not empty (to avoid overwriting with empty content on initial load)
        if (content && content.trim() !== "") {
          updateBloqContent(bloqId, content);

          // Debug: Log the content being synced
          console.log(
            `📝 [Editor] Syncing content for bloq ${bloqId}:`,
            content
          );
        }
      } catch (error) {
        console.error("Error syncing content to Liveblocks:", error);
      }
    };

    // Listen for changes in the Yjs fragment
    const handleFragmentChange = () => {
      // Debounce the sync to avoid too many updates
      const syncTimeout = (window as Window & { syncTimeout?: NodeJS.Timeout })
        .syncTimeout;
      if (syncTimeout) clearTimeout(syncTimeout);
      (window as Window & { syncTimeout?: NodeJS.Timeout }).syncTimeout =
        setTimeout(syncContentToLiveblocks, 500);
    };

    fragment.observe(handleFragmentChange);

    // Initial sync after a delay to ensure editor is ready
    const initialSyncTimeout = setTimeout(syncContentToLiveblocks, 1000);

    return () => {
      fragment.unobserve(handleFragmentChange);
      const syncTimeout = (window as Window & { syncTimeout?: NodeJS.Timeout })
        .syncTimeout;
      if (syncTimeout) clearTimeout(syncTimeout);
      clearTimeout(initialSyncTimeout);
    };
  }, [editor, doc, bloqId, updateBloqContent]);

  // Load content from Liveblocks storage when editor initializes
  useEffect(() => {
    if (!editor || !currentBloq) return;

    // Get stored content from the current bloq
    const storedContent = currentBloq.content;

    // Load content from storage if it exists and editor is empty
    const loadContentFromStorage = () => {
      try {
        if (storedContent && storedContent.trim() !== "") {
          // Check if editor is empty (only has one empty paragraph)
          const editorBlocks = editor.topLevelBlocks;
          const isEmpty =
            editorBlocks.length === 1 &&
            editorBlocks[0].type === "paragraph" &&
            (!editorBlocks[0].content || editorBlocks[0].content.length === 0);

          if (isEmpty) {
            // Parse the stored content and insert it into the editor
            try {
              const parsedContent = JSON.parse(storedContent);
              editor.replaceBlocks(editor.topLevelBlocks, parsedContent);
            } catch (parseError) {
              // If parsing fails, treat it as plain text
              console.warn(
                "Failed to parse stored content as JSON, treating as plain text:",
                parseError
              );
            }
          }
        }
      } catch (error) {
        console.error("Error loading content from storage:", error);
      }
    };

    // Load content after a short delay to ensure editor is fully initialized
    const loadTimeout = setTimeout(loadContentFromStorage, 500);

    return () => {
      clearTimeout(loadTimeout);
    };
  }, [editor, currentBloq]);

  // Disable editing for viewers
  React.useEffect(() => {
    if (editor) {
      editor.isEditable = canEdit;
    }
  }, [editor, canEdit]);

  React.useEffect(() => {
    if (editor) {
      const editorElement = editor.domElement;
      if (editorElement) {
        editorElement.style.setProperty("--user-color", userColor);
      }
    }
  }, [editor, userColor]);

  if (!editor) {
    return <EditorLoadingState />;
  }

  return (
    <div
      className={cn(
        "google-card overflow-hidden transition-all duration-200",
        canEdit && "focus-within:elevation-2 focus-within:border-primary/30",
        "group relative",
        !canEdit && "opacity-90"
      )}
      // Add data attribute for theme targeting
      data-theme={theme}
    >
      {/* Toolbar - only show for editable editors */}
      {canEdit && (
        <div className="google-surface border-b border-border/30">
          <EditorToolbar editor={editor} editorSettings={editorSettings} />
        </div>
      )}

      {/* Read-only indicator */}
      {!canEdit && (
        <div className="google-surface border-b border-border/30 px-grid-3 py-grid-2">
          <div className="flex items-center gap-grid-2 text-body-small text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>Read-only mode</span>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative min-h-[150px]">
        {/* Focus indicator - only for editable editors */}
        {canEdit && (
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-opacity duration-200",
              "bg-gradient-to-r from-primary/2 via-transparent to-primary/2",
              "opacity-0 group-focus-within:opacity-100"
            )}
          />
        )}

        <div className="relative p-grid-3">
          <BlockNoteView
            editor={editor}
            theme={theme === "dark" ? "dark" : "light"} // Explicitly set theme
            className={cn(
              "editor-container",
              "prose prose-sm max-w-none",
              "text-body-large text-foreground",
              // More specific background override
              "!bg-surface",
              "[&_.bn-editor]:!bg-surface",
              "[&_.bn-editor]:border-none",
              "[&_.bn-editor]:shadow-none",
              "[&_.bn-editor]:outline-none",
              "[&_.bn-editor]:!text-foreground",
              "[&_.bn-editor_*]:!text-foreground",
              "[&_.bn-editor_*]:!bg-transparent",
              !canEdit && "[&_.bn-editor]:cursor-default",
              !canEdit && "select-text"
            )}
            sideMenu={false}
            slashMenu={false}
            formattingToolbar={false}
          />
        </div>

        {/* User indicator */}
        <div
          className={cn(
            "absolute bottom-grid-1 right-grid-2 transition-opacity duration-200",
            canEdit ? "opacity-0 group-focus-within:opacity-100" : "opacity-60"
          )}
        >
          <div className="flex items-center gap-grid-1 text-body-small text-muted-foreground">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: initialUser.current.color }}
            />
            <span>
              {canEdit ? `Editing as ${userName}` : `Viewing as ${userName}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
