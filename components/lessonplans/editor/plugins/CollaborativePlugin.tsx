import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { $getRoot } from "lexical";
import { useMutation } from "@liveblocks/react";

interface CollaborativePluginProps {
  bloqId: string;
  onUpdate: (updates: { content?: string }) => void;
}

export function CollaborativePlugin({
  bloqId,
  onUpdate,
}: CollaborativePluginProps) {
  const [editor] = useLexicalComposerContext();
  const isUpdatingRef = useRef(false);

  // Mutation to update the bloq content directly
  const updateBloqContent = useMutation(
    ({ storage }, content: string) => {
      const bloqs = storage.get("bloqs");
      const bloqIndex = bloqs.findIndex((bloq) => bloq.get("id") === bloqId);

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
    [bloqId]
  );

  // Handle local changes and sync them to Liveblocks
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      if (isUpdatingRef.current) return;

      editorState.read(() => {
        const root = $getRoot();
        const content = root.getTextContent();

        // Update Liveblocks storage
        updateBloqContent(content);

        // Also call the parent onUpdate for backward compatibility
        onUpdate({ content });
      });
    });
  }, [editor, onUpdate, updateBloqContent]);

  return null;
}
