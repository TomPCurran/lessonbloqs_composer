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

interface DeleteModalProps {
  roomId: string;
}

export function DeleteModal({ roomId }: DeleteModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      console.log("Deleting document", roomId);
      // await deleteDocument(roomId);
      setOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="p-2">
          <Image
            src="/delete.svg"
            alt="Delete document"
            width={20}
            height={20}
          />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-md bg-surface p-6 rounded-2xl shadow-lg",
          "transition-colors"
        )}
      >
        <DialogHeader className="text-center">
          <Image
            src="/assets/icons/delete-modal.svg"
            alt="Delete confirmation"
            width={48}
            height={48}
            className="mx-auto mb-4"
          />
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
