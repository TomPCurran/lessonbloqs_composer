"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
// import { deleteDocument } from "@/lib/actions/room.actions";
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
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      console.log("Deleting document", roomId);

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
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
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
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
