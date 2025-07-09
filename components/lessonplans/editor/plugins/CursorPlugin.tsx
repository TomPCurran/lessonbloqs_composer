import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { $getSelection, $isRangeSelection } from "lexical";
import { useMyPresence, useOthers } from "@liveblocks/react";

interface CursorPluginProps {
  bloqId: string;
}

export function CursorPlugin({ bloqId }: CursorPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const isUpdatingRef = useRef(false);

  // Update cursor position in presence
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      if (isUpdatingRef.current) return;

      editorState.read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          // Calculate cursor position relative to the editor
          const anchorElement = editor.getElementByKey(selection.anchor.key);

          if (anchorElement) {
            const rect = anchorElement.getBoundingClientRect();
            const cursorPosition = {
              x: rect.left + selection.anchor.offset * 8, // Approximate character width
              y: rect.top,
            };

            updateMyPresence({
              cursor: cursorPosition,
              activeBloqId: bloqId,
            });
          }
        } else {
          updateMyPresence({
            cursor: null,
            activeBloqId: bloqId,
          });
        }
      });
    });
  }, [editor, updateMyPresence, bloqId]);

  // Display other users' cursors
  const otherCursors = others
    .filter(
      (other) =>
        other.presence?.activeBloqId === bloqId && other.presence?.cursor
    )
    .map((other) => ({
      id: other.connectionId,
      cursor: other.presence.cursor!,
      user: other.presence.user,
    }));

  return (
    <>
      {otherCursors.map(({ id, cursor, user }) => (
        <div
          key={id}
          className="absolute pointer-events-none z-50"
          style={{
            left: cursor.x,
            top: cursor.y,
          }}
        >
          <div
            className="w-0.5 h-6 bg-red-500 animate-pulse"
            style={{
              backgroundColor: user?.color || "#ef4444",
            }}
          />
          <div
            className="absolute -top-6 left-1 px-2 py-1 text-xs text-white rounded shadow-lg"
            style={{
              backgroundColor: user?.color || "#ef4444",
            }}
          >
            {user?.name || "Unknown"}
          </div>
        </div>
      ))}
    </>
  );
}
