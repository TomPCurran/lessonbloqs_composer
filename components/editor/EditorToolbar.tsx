"use client";

import React from "react";
import { useEditorContentOrSelectionChange } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core";
import {
  RiBold,
  RiItalic,
  RiUnderline,
  RiStrikethrough,
  RiCodeFill,
  RiH1,
  RiH2,
  RiH3,
  RiListOrdered,
  RiListUnordered,
  RiChatQuoteLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: BlockNoteEditor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [activeStyles, setActiveStyles] = React.useState<
    ReturnType<BlockNoteEditor["getActiveStyles"]>
  >({});
  const [activeBlock, setActiveBlock] = React.useState<
    ReturnType<BlockNoteEditor["getTextCursorPosition"]>["block"] | null
  >(null);
  const [hasSelection, setHasSelection] = React.useState<boolean>(false);

  // Updates the toolbar state based on the editor's content or selection.
  useEditorContentOrSelectionChange(() => {
    if (editor) {
      setActiveStyles(editor.getActiveStyles());
      setActiveBlock(editor.getTextCursorPosition().block);
      const selection = editor.getSelection();
      setHasSelection(!!selection && selection.from !== selection.to);
    }
  }, editor);

  if (!editor) {
    return null;
  }

  // Helper function to style the toolbar buttons.
  const getButtonClass = (isActive: boolean) =>
    cn(
      "p-2 rounded-md transition-colors border",
      isActive
        ? "bg-primary/10 text-primary border-primary/20"
        : "bg-transparent hover:bg-muted/80 border-border text-foreground"
    );

  return (
    <div className="flex items-center gap-2 p-2 border-b border-border bg-surface rounded-t-lg overflow-x-auto flex-wrap">
      {/* Text Styles */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.toggleStyles({ bold: true })}
          className={getButtonClass(activeStyles["bold"])}
          title="Bold"
        >
          <RiBold />
        </button>
        <button
          onClick={() => editor.toggleStyles({ italic: true })}
          className={getButtonClass(activeStyles["italic"])}
          title="Italic"
        >
          <RiItalic />
        </button>
        <button
          onClick={() => editor.toggleStyles({ underline: true })}
          className={getButtonClass(activeStyles["underline"])}
          title="Underline"
        >
          <RiUnderline />
        </button>
        <button
          onClick={() => editor.toggleStyles({ strikethrough: true })}
          className={getButtonClass(activeStyles["strikethrough"])}
          title="Strikethrough"
        >
          <RiStrikethrough />
        </button>
        <button
          onClick={() => editor.toggleStyles({ code: true })}
          className={getButtonClass(activeStyles["code"])}
          title="Code"
        >
          <RiCodeFill />
        </button>
      </div>

      <div className="h-5 w-px bg-border mx-1" />

      {/* Block Types */}
      <div className="flex items-center gap-1">
        <button
          onClick={() =>
            editor.updateBlock(activeBlock!, {
              type: "heading",
              props: { level: 1 },
            })
          }
          className={getButtonClass(
            activeBlock?.type === "heading" && activeBlock.props.level === "1"
          )}
          title="Heading 1"
        >
          <RiH1 />
        </button>
        <button
          onClick={() =>
            editor.updateBlock(activeBlock!, {
              type: "heading",
              props: { level: 2 },
            })
          }
          className={getButtonClass(
            activeBlock?.type === "heading" && activeBlock.props.level === "2"
          )}
          title="Heading 2"
        >
          <RiH2 />
        </button>
        <button
          onClick={() =>
            editor.updateBlock(activeBlock!, {
              type: "heading",
              props: { level: 3 },
            })
          }
          className={getButtonClass(
            activeBlock?.type === "heading" && activeBlock.props.level === "3"
          )}
          title="Heading 3"
        >
          <RiH3 />
        </button>
        <button
          onClick={() =>
            editor.updateBlock(activeBlock!, { type: "bulletListItem" })
          }
          className={getButtonClass(activeBlock?.type === "bulletListItem")}
          title="Bullet List"
        >
          <RiListUnordered />
        </button>
        <button
          onClick={() =>
            editor.updateBlock(activeBlock!, { type: "numberedListItem" })
          }
          className={getButtonClass(activeBlock?.type === "numberedListItem")}
          title="Numbered List"
        >
          <RiListOrdered />
        </button>
      </div>

      <div className="h-5 w-px bg-border mx-1" />

      {/* Comment Button */}
      <div className="flex items-center">
        <button
          onClick={() => editor.comments.startPendingComment()}
          disabled={!hasSelection}
          className={cn(
            getButtonClass(false),
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          title="Add Comment"
        >
          <RiChatQuoteLine />
        </button>
      </div>
    </div>
  );
}
