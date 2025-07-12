"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useMutation, useStorage } from "@liveblocks/react";
import { useEffect } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { useYjs } from "@/lib/providers/yjsProvider";

export function Editor({
  bloqId,
  userName,
  userColor,
}: {
  bloqId: string;
  userName: string;
  userColor: string;
}) {
  const { doc, provider, awareness } = useYjs(); // Get awareness from context

  // Get the bloq's content from Liveblocks storage
  const bloqContent = useStorage((root) => {
    const bloqs = root.bloqs;
    const bloq = bloqs?.find((b: any) => b.id === bloqId);
    return bloq?.content || "";
  });

  // Mutation to update bloq content in Liveblocks storage
  const updateBloqContent = useMutation(
    ({ storage }, bloqId: string, content: string) => {
      const bloqs = storage.get("bloqs");
      const bloqIndex = bloqs?.findIndex(
        (bloq: any) => bloq.get("id") === bloqId
      );

      if (bloqIndex !== -1 && bloqIndex !== undefined) {
        const bloq = bloqs?.get(bloqIndex);
        if (bloq) {
          bloq.update({
            content: content,
            updatedAt: Date.now(),
          });
        }
      }
    },
    []
  );

  const editor = useCreateBlockNote({
    collaboration:
      doc && provider && awareness // Make sure awareness is available
        ? {
            provider,
            fragment: doc.getXmlFragment(`blocknote-${bloqId}`),
            user: {
              name: userName,
              color: userColor,
            },
          }
        : undefined,
    initialContent: bloqContent ? JSON.parse(bloqContent) : undefined,
  });

  // Set user info in awareness when editor is ready
  useEffect(() => {
    if (awareness && editor) {
      awareness.setLocalStateField("user", {
        name: userName,
        color: userColor,
      });
    }
  }, [awareness, editor, userName, userColor]);

  // Save content to Liveblocks storage when editor content changes
  useEffect(() => {
    if (!editor) return;

    const saveContent = () => {
      const content = JSON.stringify(editor.document);
      updateBloqContent(bloqId, content);
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedSave = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveContent, 3000);
    };

    const unsubscribe = editor.onChange(debouncedSave);

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [editor, bloqId, updateBloqContent]);

  // Load initial content when bloqContent changes
  useEffect(() => {
    if (editor && bloqContent) {
      try {
        const parsedContent = JSON.parse(bloqContent);
        const currentContent = JSON.stringify(editor.document);
        if (currentContent !== bloqContent) {
          editor.replaceBlocks(editor.document, parsedContent);
        }
      } catch (error) {
        console.error("Error parsing bloq content:", error);
      }
    }
  }, [editor, bloqContent]);

  if (!editor) {
    return (
      <div className="min-h-[150px] flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-[150px] border border-border rounded-lg overflow-hidden bg-surface">
      <EditorToolbar editor={editor} />
      <div className="p-4 relative">
        <BlockNoteView
          editor={editor}
          className="editor"
          sideMenu={false}
          slashMenu={false}
          formattingToolbar={false}
        />
      </div>
    </div>
  );
}
