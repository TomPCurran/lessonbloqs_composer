"use client";

import React from "react";
import { useEditorContentOrSelectionChange } from "@blocknote/react";

interface EditorToolbarProps {
  editor: any;
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
  }, editor);

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

  const setBulletList = () => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: "bulletListItem",
    });
  };

  const setNumberedList = () => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: "numberedListItem",
    });
  };

  // Helper function for button styling
  const getButtonClass = (isActive: boolean) => {
    return `px-3 py-1 text-sm font-medium rounded border transition-colors ${
      isActive
        ? "bg-accent/20 text-accent border-accent/30"
        : "bg-transparent hover:bg-muted/80 border-border"
    }`;
  };

  const currentBlockType = currentBlock?.type || "paragraph";
  const currentLevel = currentBlock?.props?.level;

  return (
    <div className="flex items-center gap-2 p-2 border-b border-border bg-surface rounded-t-lg overflow-x-auto">
      {/* Text Styles */}
      <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
        <button
          onClick={toggleBold}
          className={getButtonClass(activeStyles.bold)}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={toggleItalic}
          className={getButtonClass(activeStyles.italic)}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={toggleUnderline}
          className={getButtonClass(activeStyles.underline)}
          title="Underline"
        >
          <u>U</u>
        </button>
      </div>

      {/* Block Types */}
      <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
        <button
          onClick={setParagraph}
          className={getButtonClass(currentBlockType === "paragraph")}
          title="Paragraph"
        >
          ¶
        </button>
        <button
          onClick={() => setHeading(1)}
          className={getButtonClass(
            currentBlockType === "heading" && currentLevel === 1
          )}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => setHeading(2)}
          className={getButtonClass(
            currentBlockType === "heading" && currentLevel === 2
          )}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => setHeading(3)}
          className={getButtonClass(
            currentBlockType === "heading" && currentLevel === 3
          )}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1">
        <button
          onClick={setBulletList}
          className={getButtonClass(currentBlockType === "bulletListItem")}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={setNumberedList}
          className={getButtonClass(currentBlockType === "numberedListItem")}
          title="Numbered List"
        >
          1. List
        </button>
      </div>
    </div>
  );
}
