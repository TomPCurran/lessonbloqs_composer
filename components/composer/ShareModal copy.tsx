"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UserTypeSelector from "@/components/composer/UserPermissionsSelector";
import {
  updateDocumentAccess,
  removeCollaborator,
  getRoomUsers,
} from "@/lib/actions/room.actions";
import { ShareDocumentDialogProps, UserType, User } from "@/types";
import { getUserColor, cn } from "@/lib/utils";
import {
  Share2,
  Mail,
  Users,
  Crown,
  Eye,
  Edit,
  Loader2,
  Trash2,
} from "lucide-react";

const ShareModal = ({
  roomId,
  creatorId,
  currentUserType,
  currentUser,
  trigger, // Accept custom trigger
}: Omit<ShareDocumentDialogProps, "collaborators"> & {
  trigger?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removingUser, setRemovingUser] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingPermission, setEditingPermission] =
    useState<UserType>("viewer");
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<UserType>("viewer");
  const [roomUsers, setRoomUsers] = useState<
    { email: string; access: string[] }[]
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch all users with access to the room
  const fetchRoomUsers = async () => {
    if (!open) return;

    setLoadingUsers(true);
    try {
      const roomData = await getRoomUsers(roomId);
      const users = Object.entries(roomData.usersAccesses).map(
        ([email, access]) => ({
          email,
          access: access as string[],
        })
      );
      setRoomUsers(users);
    } catch (error) {
      console.error("Failed to fetch room users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch users when modal opens
  useEffect(() => {
    if (open) {
      fetchRoomUsers();
    }
  }, [open, roomId]);

  // Convert access type to user type
  const getAccessTypeToUserType = (access: string[]): UserType => {
    if (access.includes("room:write")) {
      return "editor";
    } else if (access.includes("room:read")) {
      return "viewer";
    }
    return "viewer";
  };

  // Create user objects for display
  const getAllUsersWithAccess = (): User[] => {
    const users: User[] = [];

    // Add current user first with proper user type determination
    const currentUserObj = {
      id: currentUser.id,
      name: `${currentUser.firstName || ""} ${
        currentUser.lastName || ""
      }`.trim(),
      email: currentUser.email,
      avatar: currentUser.imageUrl,
      color: getUserColor(currentUser.id),
      userType: currentUserType,
    };

    // Use getActualUserType to determine if current user is actually the creator
    currentUserObj.userType = getActualUserType(currentUserObj);
    users.push(currentUserObj);

    // Add other users from room access
    roomUsers.forEach(({ email, access }) => {
      if (email !== currentUser.email) {
        const userType = getAccessTypeToUserType(access);
        users.push({
          id: email, // Use email as ID for now
          name: email.split("@")[0], // Use email prefix as name
          email: email,
          avatar: "", // No avatar for now
          color: getUserColor(email),
          userType: userType,
        });
      }
    });

    return users;
  };

  const shareDocumentHandler = async () => {
    if (!currentUser || !email.trim()) return;

    setLoading(true);

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

    try {
      await updateDocumentAccess({
        roomId,
        email: email.trim().toLowerCase(),
        userType: permission,
        updatedBy,
      });

      setEmail("");
      setPermission("viewer");
      // Refresh the room users after adding someone
      await fetchRoomUsers();
    } catch (error) {
      console.error("Failed to share document:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPermissionHandler = async (
    userEmail: string,
    newPermission: UserType
  ) => {
    if (!currentUser || !userEmail) return;

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

    try {
      await updateDocumentAccess({
        roomId,
        email: userEmail.toLowerCase(),
        userType: newPermission,
        updatedBy,
      });
      // Refresh the room users after updating permissions
      await fetchRoomUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user permission:", error);
    }
  };

  const removeUserHandler = async (email: string) => {
    if (!email || email === currentUser.email) return;

    setRemovingUser(email);

    try {
      const removedBy: User = {
        id: currentUser.id,
        name: `${currentUser.firstName || ""} ${
          currentUser.lastName || ""
        }`.trim(),
        email: currentUser.email,
        avatar: currentUser.imageUrl,
        color: getUserColor(currentUser.id),
        userType: currentUserType,
      };

      await removeCollaborator({
        roomId,
        email: email.toLowerCase(),
        removedBy,
      });
      // Refresh the room users after removing someone
      await fetchRoomUsers();
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
      // You might want to show an error message to the user here
    } finally {
      setRemovingUser(null);
    }
  };

  const getUserTypeIcon = (userType: UserType) => {
    switch (userType) {
      case "creator":
        return <Crown className="w-3 h-3" />;
      case "editor":
        return <Edit className="w-3 h-3" />;
      case "viewer":
        return <Eye className="w-3 h-3" />;
      default:
        return <Eye className="w-3 h-3" />;
    }
  };

  const getUserTypeColor = (userType: UserType) => {
    switch (userType) {
      case "creator":
        return "bg-primary text-primary-foreground";
      case "editor":
        return "bg-secondary text-secondary-foreground";
      case "viewer":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Determine actual user type based on creatorId and user permissions
  const getActualUserType = (collaborator: User): UserType => {
    if (collaborator.id === creatorId) {
      return "creator";
    }
    return collaborator.userType || "viewer";
  };

  // Check if current user can edit permissions
  const canEditPermissions = (targetUser: User): boolean => {
    const targetUserType = getActualUserType(targetUser);

    // Viewers cannot edit any permissions
    if (currentUserType === "viewer") return false;

    // Cannot edit your own permissions
    if (targetUser.email === currentUser.email) return false;

    // Cannot edit creator permissions
    if (targetUserType === "creator") return false;

    // Creators and editors can edit viewer permissions
    if (targetUserType === "viewer") return true;

    // Only creators can edit editor permissions
    if (targetUserType === "editor") {
      return currentUserType === "creator";
    }

    return false;
  };

  const allUsers = getAllUsersWithAccess();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className={cn(
              "google-button-primary h-10",
              currentUserType === "viewer" && "opacity-50 cursor-not-allowed"
            )}
            disabled={currentUserType === "viewer"}
          >
            <Share2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className={cn(
          "google-card max-w-2xl w-full p-0 gap-0",
          "elevation-4 border-border/50"
        )}
      >
        {/* Header */}
        <DialogHeader className="p-grid-4 pb-grid-3 border-b border-border/50">
          <div className="flex items-center gap-grid-2 mb-grid-1">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-headline-medium">
              Share Document
            </DialogTitle>
          </div>
          <DialogDescription className="text-body-medium text-muted-foreground">
            Invite collaborators to view and edit this document
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="share-modal-content p-grid-4">
          {/* Invite Section */}
          <div className="space-grid-3">
            <div className="space-grid-1">
              <Label
                htmlFor="email"
                className="text-label-large text-foreground"
              >
                Invite by email
              </Label>
              <p className="text-body-small text-muted-foreground">
                Enter email address to send an invitation
              </p>
            </div>

            <div className="space-grid-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="google-input pl-14"
                  disabled={currentUserType === "viewer" || loading}
                />
              </div>

              <div className="share-modal-row">
                <div className="flex-1 min-w-0">
                  <UserTypeSelector
                    userType={permission}
                    setUserType={setPermission}
                    disabled={currentUserType === "viewer" || loading}
                  />
                </div>
                <Button
                  onClick={shareDocumentHandler}
                  disabled={
                    !email.trim() || loading || currentUserType === "viewer"
                  }
                  className="google-button-primary min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Invite"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Current Access Section */}
          <div className="space-grid-3">
            <div className="flex items-center justify-between">
              <h4 className="text-label-large text-foreground">
                Current Access ({allUsers.length})
              </h4>
              {loadingUsers && (
                <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </div>
              )}
            </div>

            <div className="space-grid-1 max-h-48 overflow-y-auto">
              {allUsers.map((user) => {
                const actualUserType = getActualUserType(user);
                const canRemove =
                  currentUserType !== "viewer" &&
                  user.email !== currentUser.email &&
                  actualUserType !== "creator";
                const canEdit = canEditPermissions(user);

                return (
                  <div
                    key={user.email}
                    className={cn(
                      "google-surface p-grid-3 rounded-lg",
                      "flex items-center gap-grid-3",
                      "border border-border/30"
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-background">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-white text-sm font-medium"
                            style={{
                              backgroundColor: user.color || "#888",
                            }}
                          >
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-grid-1 mb-1">
                        <p className="text-body-medium font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        {actualUserType === "creator" && (
                          <Crown className="w-3 h-3 text-primary" />
                        )}
                      </div>
                      <p className="text-body-small text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Role Badge or Permission Selector */}
                    <div className="flex items-center gap-2">
                      {editingUser === user.email ? (
                        <div className="flex items-center gap-2">
                          <UserTypeSelector
                            userType={editingPermission}
                            setUserType={setEditingPermission}
                            onClickHandler={(newType) =>
                              updateUserPermissionHandler(
                                user.email,
                                newType as UserType
                              )
                            }
                            disabled={false}
                          />
                          {editingUser === user.email && (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          )}
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                            getUserTypeColor(actualUserType)
                          )}
                        >
                          {getUserTypeIcon(actualUserType)}
                          <span className="capitalize">{actualUserType}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      {/* Edit Permission Button */}
                      {canEdit && editingUser !== user.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user.email);
                            setEditingPermission(actualUserType);
                          }}
                          className="h-8 w-8 p-0 text-secondary hover:text-secondary hover:bg-secondary/10"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}

                      {/* Remove Button */}
                      {canRemove && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUserHandler(user.email)}
                          disabled={removingUser === user.email}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {removingUser === user.email ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Viewer Notice */}
          {currentUserType === "viewer" && (
            <div
              className={cn(
                "google-surface p-grid-3 rounded-lg",
                "border border-warning/30 bg-warning/5"
              )}
            >
              <div className="flex items-center gap-grid-2">
                <Eye className="w-4 h-4 text-warning" />
                <p className="text-body-small text-warning font-medium">
                  You have view-only access to this document
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ShareModal);
