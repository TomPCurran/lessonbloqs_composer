"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/stores/appStore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface DeleteModalProps {
  roomId: string;
  onDelete?: (roomId: string) => Promise<void>;
  trigger?: React.ReactNode;
}

export function DeleteModal({ roomId, onDelete, trigger }: DeleteModalProps) {
  const [open, setOpen] = useState(false);
  // No local loading state
  const setGlobalLoading = useAppStore((s) => s.setGlobalLoading);
  const setGlobalError = useAppStore((s) => s.setGlobalError);

  const handleDelete = async () => {
    setGlobalLoading(true, "Deleting document...");
    try {
      if (onDelete) {
        await onDelete(roomId);
      } else {
        // Fallback to direct server action if no callback provided
        const { deleteDocument } = await import("@/lib/actions/room.actions");
        await deleteDocument(roomId);
      }
      setOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      setGlobalError("Failed to delete document. Please try again.");
    } finally {
      setGlobalLoading(false, "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon" className="p-2">
            <Trash className="w-4 h-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-md bg-surface p-6 rounded-2xl shadow-lg",
          "transition-colors"
        )}
      >
        <DialogHeader className="text-center">
          <DialogTitle>Delete Document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            // No local loading state
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
