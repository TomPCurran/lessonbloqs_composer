"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister, $findMatchingParent } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $createParagraphNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const LowPriority = 1;

function Divider() {
  return <div className="w-px h-6 bg-border/60 mx-2" />;
}

function useActiveBlock(): string | null {
  const [editor] = useLexicalComposerContext();
  const subscribe = useCallback(
    (onStoreChange: () => void) => editor.registerUpdateListener(onStoreChange),
    [editor]
  );
  const getSnapshot = useCallback((): string | null => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;
      const anchor = selection.anchor.getNode();
      const element =
        anchor.getKey() === "root"
          ? anchor
          : $findMatchingParent(anchor, (node) => {
              const parent = node.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            }) || anchor;
      if ($isHeadingNode(element)) {
        return element.getTag();
      }
      return element.getType();
    });
  }, [editor]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const activeBlock = useActiveBlock();

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
      }
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(UNDO_COMMAND, () => false, LowPriority),
      editor.registerCommand(REDO_COMMAND, () => false, LowPriority),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbar);
      })
    );
  }, [editor, updateToolbar]);

  function toggleBlock(type: "h1" | "h2" | "h3" | "quote") {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (activeBlock === type) {
        // Convert to paragraph
        const paragraph = $createParagraphNode();
        selection.insertNodes([paragraph]);
      } else if (type === "quote") {
        // Convert to quote
        const quote = $createQuoteNode();
        selection.insertNodes([quote]);
      } else {
        // Convert to heading
        const heading = $createHeadingNode(type);
        selection.insertNodes([heading]);
      }
    });
  }

  const btnClass = (active = false, disabled = false) =>
    cn(
      "flex items-center justify-center w-8 h-8 rounded-lg",
      "transition-colors duration-200 hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
      active && "bg-primary text-primary-foreground shadow-sm",
      disabled && "opacity-50 cursor-not-allowed"
    );

  return (
    <TooltipProvider delayDuration={300}>
      <div
        ref={toolbarRef}
        className="flex items-center gap-1 p-2 bg-surface/50 backdrop-blur-md rounded-t-md border-b border-border text-foreground"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled={!canUndo}
              onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
              className={btnClass(false, !canUndo)}
              aria-label="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Undo (Ctrl+Z)
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled={!canRedo}
              onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
              className={btnClass(false, !canRedo)}
              aria-label="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Redo (Ctrl+Y)
          </TooltipContent>
        </Tooltip>

        <Divider />

        {(["h1", "h2", "h3", "quote"] as const).map((t, i) => {
          const Icon = [Heading1, Heading2, Heading3, AlignJustify][i];
          return (
            <Tooltip key={t}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleBlock(t)}
                  className={btnClass(activeBlock === t)}
                  aria-label={t}
                >
                  <Icon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {t.toUpperCase()}
              </TooltipContent>
            </Tooltip>
          );
        })}

        <Divider />

        {(
          [
            [Bold, isBold, "bold"],
            [Italic, isItalic, "italic"],
            [Underline, isUnderline, "underline"],
            [Strikethrough, isStrikethrough, "strikethrough"],
          ] as const
        ).map(([Icon, active, format]) => (
          <Tooltip key={format}>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
                }}
                className={btnClass(active)}
                aria-label={format}
              >
                <Icon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {format.charAt(0).toUpperCase() + format.slice(1)}
            </TooltipContent>
          </Tooltip>
        ))}

        <Divider />

        {(
          [
            [AlignLeft, "left"],
            [AlignCenter, "center"],
            [AlignRight, "right"],
            [AlignJustify, "justify"],
          ] as const
        ).map(([Icon, fmt]) => (
          <Tooltip key={fmt}>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, fmt)
                }
                className={btnClass()}
                aria-label={fmt}
              >
                <Icon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
