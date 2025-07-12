"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useRoom } from "@liveblocks/react";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { EditorToolbar } from "./EditorToolbar";

export function Editor({ bloqId }: { bloqId: string }) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  // Create isolated Yjs document for this specific bloq
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc, {
      awareness: `bloq-awareness-${bloqId}`,
    });

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yProvider?.destroy();
      yDoc?.destroy();
    };
  }, [room, bloqId]);

  const editor = useCreateBlockNote({
    collaboration:
      doc && provider
        ? {
            provider,
            fragment: doc.getXmlFragment(`blocknote-${bloqId}`),
            user: {
              name: "User",
              color: "#ff0000",
            },
          }
        : undefined,
  });

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
          // The menu on text selection is the formattingToolbar, not a suggestionMenu.
          formattingToolbar={false}
        />
      </div>
    </div>
  );
}
