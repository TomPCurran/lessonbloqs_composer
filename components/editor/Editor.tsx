"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useRoom, useSelf } from "@liveblocks/react";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";

export function Editor({ bloqId }: { bloqId: string }) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  // Create isolated Yjs document for this specific bloq
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc, {
      // Use bloqId to create completely separate document space
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
    <div className="min-h-[150px]">
      <BlockNoteView editor={editor} className="editor" />
    </div>
  );
}
