"use client";

import { useCreateBlockNoteWithLiveblocks } from "@liveblocks/react-blocknote";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect, useRef } from "react";
import { EditorToolbar } from "./EditorToolbar";

export function Editor({ bloqId }: { bloqId: string }) {
  const editorRef = useRef<any>(null);

  const editor = useCreateBlockNoteWithLiveblocks({
    storageKey: `bloq-${bloqId}`,
    sideMenu: false, // This disables the drag handle/side menu
    slashMenu: false, // This disables the slash menu
  });

  useEffect(() => {
    editorRef.current = editor;

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
      }
    };
  }, [editor, bloqId]);

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
      <div className="p-4">
        <BlockNoteView
          editor={editor}
          className="editor"
          sideMenu={false}
          slashMenu={false}
        />
      </div>
    </div>
  );
}
