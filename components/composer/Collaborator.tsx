import Image from "next/image";
import React, { useState } from "react";
import UserTypeSelector from "@/components/composer/UserPermissionsSelector";
import { Button } from "@/components/ui/button";
import {
  removeCollaborator,
  updateDocumentAccess,
} from "@/lib/actions/room.actions";
import { CollaboratorProps, UserType } from "@/types";
import { Crown, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Collaborator = ({
  roomId,
  creatorId,
  collaborator,
  email,
  user,
  currentUserType,
}: CollaboratorProps) => {
  const [userType, setUserType] = useState(collaborator.userType || "viewer");
  const [loading, setLoading] = useState(false);

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);

    await updateDocumentAccess({
      roomId,
      email,
      userType: type as UserType,
      updatedBy: user,
    });

    setLoading(false);
  };

  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);

    await removeCollaborator({ roomId, email });

    setLoading(false);
  };

  // Check if this collaborator is the current user
  const isCurrentUser = collaborator.email === user.email;
  const isOwner = creatorId === collaborator.id;

  return (
    <li className="google-surface p-grid-3 rounded-lg border border-border/30 hover:elevation-1 transition-all duration-200">
      <div className="flex items-center justify-between gap-grid-3">
        {/* User Info */}
        <div className="flex items-center gap-grid-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative">
            <Image
              src={collaborator.avatar}
              alt={collaborator.name}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full ring-2 ring-background"
            />
            {isOwner && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-grid-1 mb-1">
              <p className="text-body-medium font-medium text-foreground truncate">
                {collaborator.name}
                {loading && (
                  <span className="ml-2 text-muted-foreground text-body-small">
                    updating...
                  </span>
                )}
              </p>
            </div>
            <p className="text-body-small text-muted-foreground truncate">
              {collaborator.email}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-grid-2">
          {isOwner ? (
            <div className="px-grid-2 py-1 rounded-md bg-primary/10 text-primary">
              <span className="text-body-small font-medium">Owner</span>
            </div>
          ) : currentUserType === "viewer" ? (
            <div
              className={cn(
                "px-grid-2 py-1 rounded-md text-body-small font-medium capitalize",
                collaborator.userType === "editor"
                  ? "bg-secondary/10 text-secondary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {collaborator.userType}
            </div>
          ) : isCurrentUser ? (
            <div
              className={cn(
                "px-grid-2 py-1 rounded-md text-body-small font-medium capitalize",
                collaborator.userType === "editor"
                  ? "bg-secondary/10 text-secondary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {collaborator.userType}
            </div>
          ) : (
            <div className="flex items-center gap-grid-2">
              <UserTypeSelector
                userType={userType as UserType}
                setUserType={setUserType}
                onClickHandler={shareDocumentHandler}
                disabled={loading}
              />
              <Button
                type="button"
                onClick={() => removeCollaboratorHandler(collaborator.email)}
                disabled={loading}
                className="google-button-ghost h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default Collaborator;
