"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, User, FileText } from "lucide-react";
import {
  useInboxNotifications,
  useMarkInboxNotificationAsRead,
} from "@liveblocks/react/suspense";
import { cn } from "@/lib/utils";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // This is the hook that should work now
  const { inboxNotifications } = useInboxNotifications();
  const markAsRead = useMarkInboxNotificationAsRead();

  console.log("🔔 [Notifications] inboxNotifications:", inboxNotifications);

  // Debug: Log the structure of the first notification
  if (inboxNotifications.length > 0) {
    console.log("🔔 [Notifications] First notification structure:", {
      id: inboxNotifications[0].id,
      kind: inboxNotifications[0].kind,
      hasActivities: !!inboxNotifications[0].activities,
      activitiesLength: inboxNotifications[0].activities?.length || 0,
      firstActivity: inboxNotifications[0].activities?.[0],
      roomId: inboxNotifications[0].roomId,
      readAt: inboxNotifications[0].readAt,
    });
  }

  // Filter unread notifications
  const unreadCount = inboxNotifications.filter(
    (notification) => !notification.readAt
  ).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      console.log("🔔 [Notifications] Marked as read:", notificationId);
    } catch (error) {
      console.error("🔔 [Notifications] Error marking as read:", error);
    }
  };

  // Helper function to safely get activity data
  const getActivityData = (notification: any) => {
    return notification.activities?.[0]?.data || {};
  };

  // Helper function to get notification title
  const getNotificationTitle = (notification: any) => {
    const activityData = getActivityData(notification);

    // Use custom message if available, otherwise fall back to title or default
    if (activityData.customMessage) {
      return activityData.customMessage;
    }

    // Handle different notification types with fallbacks
    switch (notification.kind) {
      case "$documentAccess":
        if (activityData.isRemoval) {
          return `You were removed from "${
            activityData.documentTitle || "a document"
          }"`;
        }
        if (activityData.isNewShare) {
          return `${activityData.updatedBy} shared "${
            activityData.documentTitle || "a document"
          }" with you`;
        }
        return `Your permissions for "${
          activityData.documentTitle || "a document"
        }" were updated`;

      case "$documentShared":
        return `${activityData.sharedBy} shared "${
          activityData.documentTitle || "a document"
        }" with you`;

      case "$documentComment":
        return `${activityData.mentionedBy} mentioned you in "${
          activityData.documentTitle || "a document"
        }"`;

      default:
        return (
          activityData.title ||
          `New ${notification.kind.replace("$", "")} notification`
        );
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read when clicked
    if (!notification.readAt) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate to the document if documentId is available
    const activityData = getActivityData(notification);
    const documentId = activityData.documentId || notification.roomId;

    if (documentId) {
      setIsOpen(false);
      router.push(`/lessonplans/${documentId}`);
    }
  };

  const getNotificationIcon = (kind: string, activityData?: any) => {
    switch (kind) {
      case "$documentAccess":
        if (activityData?.isRemoval) {
          return <X className="w-4 h-4 text-red-500" />;
        }
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "$documentShared":
        return <FileText className="w-4 h-4 text-green-500" />;
      case "$documentComment":
        return <User className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "Unknown time";

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Unknown time";

      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      return "Unknown time";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label={`Notifications${
            unreadCount > 0 ? ` (${unreadCount} unread)` : ""
          }`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {inboxNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {inboxNotifications.map((notification) => {
                const activityData = getActivityData(notification);
                const notificationTitle = getNotificationTitle(notification);

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-accent/50 transition-colors relative cursor-pointer",
                      !notification.readAt &&
                        "bg-blue-50/50 dark:bg-blue-950/20"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.kind, activityData)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {notificationTitle}
                            </p>

                            {/* Enhanced notification details */}
                            <div className="mt-1 space-y-1">
                              {/* Document title */}
                              {activityData.documentTitle && (
                                <p className="text-xs text-muted-foreground">
                                  Document:{" "}
                                  <span className="font-medium">
                                    {activityData.documentTitle}
                                  </span>
                                </p>
                              )}

                              {/* User who performed the action */}
                              {(activityData.updatedBy ||
                                activityData.sharedBy ||
                                activityData.mentionedBy) && (
                                <p className="text-xs text-muted-foreground">
                                  By:{" "}
                                  {activityData.updatedBy ||
                                    activityData.sharedBy ||
                                    activityData.mentionedBy}
                                </p>
                              )}

                              {/* Permission change details */}
                              {notification.kind === "$documentAccess" &&
                                activityData.userType &&
                                !activityData.isRemoval && (
                                  <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Access level:{" "}
                                    <span className="font-medium capitalize">
                                      {activityData.userType}
                                    </span>
                                    {activityData.previousUserType && (
                                      <span>
                                        {" "}
                                        (changed from{" "}
                                        {activityData.previousUserType})
                                      </span>
                                    )}
                                  </p>
                                )}

                              {/* Comment preview */}
                              {notification.kind === "$documentComment" &&
                                activityData.comment && (
                                  <p className="text-xs text-muted-foreground italic">
                                    "{activityData.comment}"
                                  </p>
                                )}
                            </div>
                          </div>

                          {!notification.readAt && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="h-6 w-6 p-0 hover:bg-accent"
                              aria-label="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTime(
                            activityData.timestamp ||
                              notification.activities?.[0]?.createdAt ||
                              notification.createdAt ||
                              ""
                          )}
                        </p>
                      </div>
                    </div>

                    {!notification.readAt && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {inboxNotifications.length > 0 && (
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
