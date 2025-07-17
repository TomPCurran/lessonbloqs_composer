"use client";

import React from "react";
import { useEditorContentOrSelectionChange } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core"; // Import the type
import { Bold, Italic, Underline, Type, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: BlockNoteEditor | null; // Use the specific type instead of 'any'
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [currentBlock, setCurrentBlock] = React.useState<any>(null);
  const [activeStyles, setActiveStyles] = React.useState<any>({});

  // Update active states when editor content changes
  useEditorContentOrSelectionChange(() => {
    if (editor) {
      const block = editor.getTextCursorPosition().block;
      const styles = editor.getActiveStyles();
      setCurrentBlock(block);
      setActiveStyles(styles);
    }
  }, editor ?? undefined);

  if (!editor) return null;

  const toggleBold = () => editor.toggleStyles({ bold: true });
  const toggleItalic = () => editor.toggleStyles({ italic: true });
  const toggleUnderline = () => editor.toggleStyles({ underline: true });

  const setHeading = (level: 1 | 2 | 3) => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: "heading",
      props: { level },
    });
  };

  const setParagraph = () => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: "paragraph",
    });
  };

  // Fixed list methods
  const setBulletList = () => {
    const currentBlock = editor.getTextCursorPosition().block;

    if (currentBlock.type === "bulletListItem") {
      // If already a bullet list, convert to paragraph
      editor.updateBlock(currentBlock, {
        type: "paragraph",
      });
    } else {
      // Convert to bullet list
      editor.updateBlock(currentBlock, {
        type: "bulletListItem",
      });
    }
  };

  const setNumberedList = () => {
    const currentBlock = editor.getTextCursorPosition().block;

    if (currentBlock.type === "numberedListItem") {
      // If already a numbered list, convert to paragraph
      editor.updateBlock(currentBlock, {
        type: "paragraph",
      });
    } else {
      // Convert to numbered list
      editor.updateBlock(currentBlock, {
        type: "numberedListItem",
      });
    }
  };

  const currentBlockType = currentBlock?.type || "paragraph";
  const currentLevel = currentBlock?.props?.level;

  return (
    <div className="flex items-center gap-grid-1 p-grid-2 overflow-x-auto">
      {/* Text Formatting Group */}
      <div className="flex items-center rounded-lg border border-border/30 p-0.5 bg-surface-variant/30">
        <button
          onClick={toggleBold}
          className={cn(
            "toolbar-button h-8 w-8 p-0 rounded-md transition-all duration-200",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/20",
            activeStyles.bold && "bg-primary/15 text-primary"
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={toggleItalic}
          className={cn(
            "toolbar-button h-8 w-8 p-0 rounded-md transition-all duration-200",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/20",
            activeStyles.italic && "bg-primary/15 text-primary"
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={toggleUnderline}
          className={cn(
            "toolbar-button h-8 w-8 p-0 rounded-md transition-all duration-200",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/20",
            activeStyles.underline && "bg-primary/15 text-primary"
          )}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      {/* Block Type Group */}
      <div className="flex items-center rounded-lg border border-border/30 p-0.5 bg-surface-variant/30">
        <button
          onClick={setParagraph}
          className={cn(
            "toolbar-button h-8 px-2 text-body-small font-medium rounded-md transition-all duration-200",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-secondary/20",
            currentBlockType === "paragraph" && "bg-secondary/15 text-secondary"
          )}
          title="Paragraph"
        >
          <Type className="w-3 h-3 mr-1" />P
        </button>
        <button
          onClick={() => setHeading(1)}
          className={cn(
            "toolbar-button h-8 px-2 text-body-small font-bold rounded-md transition-all duration-200",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-secondary/20",
            currentBlockType === "heading" &&
              currentLevel === 1 &&
              "bg-secondary/15 text-secondary"
          )}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => setHeading(2)}
          className={cn(
            "toolbar-button h-8 px-2 text-body-small font-semibold rounded-md transition-all duration-200",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-secondary/20",
            currentBlockType === "heading" &&
              currentLevel === 2 &&
              "bg-secondary/15 text-secondary"
          )}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => setHeading(3)}
          className={cn(
            "toolbar-button h-8 px-2 text-body-small font-medium rounded-md transition-all duration-200",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-secondary/20",
            currentBlockType === "heading" &&
              currentLevel === 3 &&
              "bg-secondary/15 text-secondary"
          )}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      {/* List Group */}
      <div className="flex items-center rounded-lg border border-border/30 p-0.5 bg-surface-variant/30">
        <button
          onClick={setBulletList}
          className={cn(
            "toolbar-button h-8 px-2 rounded-md transition-all duration-200",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-accent/20",
            currentBlockType === "bulletListItem" && "bg-accent/15 text-accent"
          )}
          title="Bullet List"
        >
          <List className="w-4 h-4 mr-1" />
          <span className="text-body-small">List</span>
        </button>
        <button
          onClick={setNumberedList}
          className={cn(
            "toolbar-button h-8 px-2 rounded-md transition-all duration-200",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-accent/20",
            currentBlockType === "numberedListItem" &&
              "bg-accent/15 text-accent"
          )}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4 mr-1" />
          <span className="text-body-small">1,2,3</span>
        </button>
      </div>
    </div>
  );
}
