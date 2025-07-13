"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UserTypeSelector from "@/components/composer/UserPermissionsSelector";
import { updateDocumentAccess } from "@/lib/actions/room.actions";
import { ShareDocumentDialogProps, UserType, User } from "@/types";
import { getUserColor } from "@/lib/utils";
import { Cross } from "lucide-react";

const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
  currentUser, // Use the new prop
}: ShareDocumentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<UserType>("viewer");

  const shareDocumentHandler = async () => {
    // No longer need to check for user.info, we have the currentUser prop
    if (!currentUser) return;

    setLoading(true);

    // Construct the 'updatedBy' object from the currentUser prop
    const updatedBy: User = {
      id: currentUser.id,
      name: `${currentUser.firstName || ""} ${
        currentUser.lastName || ""
      }`.trim(),
      email: currentUser.email,
      avatar: currentUser.imageUrl,
      color: getUserColor(currentUser.id),
      userType: currentUserType,
    };

    await updateDocumentAccess({
      roomId,
      email,
      userType: permission,
      updatedBy,
    });

    setLoading(false);
    setEmail("");
    setPermission("viewer");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gradient-blue flex h-9 gap-1 px-4"
          disabled={currentUserType === "viewer"}
        >
          <Cross />

          <p className="mr-1 hidden sm:block">Share</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>
            Select which users can view and edit this document
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="email" className="mt-6 text-blue-100">
          Email address
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="share-input"
              disabled={currentUserType === "viewer"}
            />
            <UserTypeSelector
              userType={permission}
              setUserType={setPermission}
              disabled={currentUserType === "viewer"}
            />
          </div>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="gradient-blue flex h-full gap-1 px-5"
            disabled={loading || currentUserType === "viewer"}
          >
            {loading ? "Sending..." : "Invite"}
          </Button>
        </div>

        {collaborators && collaborators.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Shared with:</h4>
            <ul className="space-y-1">
              {collaborators.map((collaborator) => (
                <li
                  key={collaborator.email}
                  className="flex items-center gap-2"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: collaborator.color || "#888" }}
                  />
                  <span className="font-medium">{collaborator.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {collaborator.email}
                  </span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-muted">
                    {collaborator.userType}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ShareModal);
