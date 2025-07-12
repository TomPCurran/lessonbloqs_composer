// "use client";

// import { useCreateBlockNote } from "@blocknote/react";
// import { BlockNoteView } from "@blocknote/mantine";
// import { useRoom } from "@liveblocks/react";
// import { useEffect, useState } from "react";
// import * as Y from "yjs";
// import { LiveblocksYjsProvider } from "@liveblocks/yjs";
// import { EditorToolbar } from "./EditorToolbar";

// export function Editor({ bloqId }: { bloqId: string }) {
//   const room = useRoom();
//   const [doc, setDoc] = useState<Y.Doc>();
//   const [provider, setProvider] = useState<any>();

//   // Create isolated Yjs document for this specific bloq
//   useEffect(() => {
//     const yDoc = new Y.Doc();
//     const yProvider = new LiveblocksYjsProvider(room, yDoc, {
//       awareness: `bloq-awareness-${bloqId}`,
//     });

//     setDoc(yDoc);
//     setProvider(yProvider);

//     return () => {
//       yProvider?.destroy();
//       yDoc?.destroy();
//     };
//   }, [room, bloqId]);

//   const editor = useCreateBlockNote({
//     collaboration:
//       doc && provider
//         ? {
//             provider,
//             fragment: doc.getXmlFragment(`blocknote-${bloqId}`),
//             user: {
//               name: "User",
//               color: "#ff0000",
//             },
//           }
//         : undefined,
//   });

//   if (!editor) {
//     return (
//       <div className="min-h-[150px] flex items-center justify-center text-muted-foreground">
//         Loading editor...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[150px] border border-border rounded-lg overflow-hidden bg-surface">
//       <EditorToolbar editor={editor} />
//       <div className="p-4">
//         <BlockNoteView
//           editor={editor}
//           className="editor"
//           sideMenu={false}
//           slashMenu={false}
//           // The menu on text selection is the formattingToolbar, not a suggestionMenu.
//           formattingToolbar={false}
//         />
//       </div>
//     </div>
//   );
// }
"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useRoom, useMutation, useStorage } from "@liveblocks/react";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { EditorToolbar } from "./EditorToolbar";

export function Editor({ bloqId }: { bloqId: string }) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

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
    initialContent: bloqContent ? JSON.parse(bloqContent) : undefined,
  });

  // Save content to Liveblocks storage when editor content changes
  useEffect(() => {
    if (!editor) return;

    const saveContent = () => {
      const content = JSON.stringify(editor.document);
      updateBloqContent(bloqId, content);
    };

    // Save content after a delay to avoid too frequent saves
    let timeoutId: NodeJS.Timeout;
    const debouncedSave = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveContent, 1000); // Save after 1 second of inactivity
    };

    // Listen for editor changes
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
        // Only update if content is different to avoid infinite loops
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
      <div className="p-4">
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
