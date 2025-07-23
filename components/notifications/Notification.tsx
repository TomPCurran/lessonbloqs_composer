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
  useMarkAllInboxNotificationsAsRead,
} from "@liveblocks/react/suspense";
import type {
  InboxNotificationData,
  InboxNotificationCustomData,
} from "@liveblocks/core";
import { cn } from "@/lib/utils";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // This is the hook that should work now
  const { inboxNotifications } = useInboxNotifications();
  const markAsRead = useMarkInboxNotificationAsRead();
  const markAllAsRead = useMarkAllInboxNotificationsAsRead();

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

  // Helper: Type guards for notification kinds
  function isCustomNotification(
    notification: InboxNotificationData
  ): notification is InboxNotificationCustomData {
    return (
      typeof notification.kind === "string" &&
      notification.kind !== "thread" &&
      notification.kind !== "textMention" &&
      Object.prototype.hasOwnProperty.call(notification, "activities")
    );
  }

  function isThreadNotification(
    notification: InboxNotificationData
  ): notification is Extract<InboxNotificationData, { kind: "thread" }> {
    return notification.kind === "thread";
  }

  function isTextMentionNotification(
    notification: InboxNotificationData
  ): notification is Extract<InboxNotificationData, { kind: "textMention" }> {
    return notification.kind === "textMention";
  }

  function isInboxNotificationCustomData(
    notification: InboxNotificationData
  ): notification is InboxNotificationCustomData {
    return (
      isCustomNotification(notification) &&
      "activities" in (notification as Record<string, unknown>) &&
      Array.isArray((notification as Record<string, unknown>).activities)
    );
  }

  // Helper to check if a value is probably a React element
  function isProbablyReactElement(val: unknown): boolean {
    return (
      typeof val === "object" &&
      val !== null &&
      // React elements have a $$typeof property that is a symbol
      typeof (val as { $$typeof?: unknown }).$$typeof === "symbol"
    );
  }

  // Helper function to safely get activity data for custom notifications
  const getActivityData = (
    notification: InboxNotificationData
  ): Record<string, unknown> | undefined => {
    if (isInboxNotificationCustomData(notification)) {
      const custom = notification as InboxNotificationCustomData;
      if (Array.isArray(custom.activities)) {
        const data = custom.activities[0]?.data;
        if (
          data &&
          typeof data === "object" &&
          data !== null &&
          !isProbablyReactElement(data)
        ) {
          return data as Record<string, unknown>;
        }
      }
    }
    return undefined;
  };

  // Helper function to get notification title
  const getNotificationTitle = (notification: InboxNotificationData) => {
    const activityData = getActivityData(notification);

    if (typeof activityData?.customMessage === "string") {
      return activityData.customMessage;
    }

    if (isCustomNotification(notification)) {
      switch (notification.kind) {
        case "$documentAccess":
          if (activityData?.isRemoval) {
            return `You were removed from &quot;${
              activityData?.documentTitle ?? "a document"
            }&quot;`;
          }
          if (activityData?.isNewShare) {
            return `${activityData?.updatedBy ?? "Someone"} shared &quot;${
              activityData?.documentTitle ?? "a document"
            }&quot; with you`;
          }
          return `Your permissions for &quot;${
            activityData?.documentTitle ?? "a document"
          }&quot; were updated`;
        case "$documentShared":
          return `${activityData?.sharedBy ?? "Someone"} shared &quot;${
            activityData?.documentTitle ?? "a document"
          }&quot; with you`;
        case "$documentComment":
          return `${
            activityData?.mentionedBy ?? "Someone"
          } mentioned you in &quot;${
            activityData?.documentTitle ?? "a document"
          }&quot;`;
        default:
          return typeof activityData?.title === "string"
            ? activityData.title
            : `New ${notification.kind.replace("$", "")} notification`;
      }
    } else if (isThreadNotification(notification)) {
      return "New thread notification";
    } else if (isTextMentionNotification(notification)) {
      return `You were mentioned`;
    }
    return "New notification";
  };

  const handleNotificationClick = async (
    notification: InboxNotificationData
  ) => {
    // Mark as read when clicked
    if (!notification.readAt) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate to the document if documentId is available (for custom notifications)
    const activityData = getActivityData(notification);
    let documentId: string | undefined = undefined;
    if (isCustomNotification(notification)) {
      documentId =
        typeof activityData?.documentId === "string"
          ? activityData.documentId
          : notification.roomId;
    } else if (
      isThreadNotification(notification) ||
      isTextMentionNotification(notification)
    ) {
      documentId = notification.roomId;
    }
    if (documentId) {
      setIsOpen(false);
      router.push(`/lessonplans/${documentId}`);
    }
  };

  const getNotificationIcon = (
    notification: InboxNotificationData,
    activityData?: Record<string, unknown>
  ) => {
    if (isCustomNotification(notification)) {
      switch (notification.kind) {
        case "$documentAccess":
          if (
            activityData &&
            typeof activityData === "object" &&
            "isRemoval" in activityData &&
            activityData.isRemoval
          ) {
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
    } else if (isThreadNotification(notification)) {
      return <FileText className="w-4 h-4 text-blue-500" />;
    } else if (isTextMentionNotification(notification)) {
      return <User className="w-4 h-4 text-orange-500" />;
    }
    return <Bell className="w-4 h-4 text-gray-500" />;
  };

  const formatTime = (timestamp: string | Date | null | undefined) => {
    if (!timestamp) return "Unknown time";
    let date: Date;
    if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      return "Unknown time";
    }
    if (isNaN(date.getTime())) return "Unknown time";
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
              {inboxNotifications.map((notification: InboxNotificationData) => {
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
                        {getNotificationIcon(notification, activityData)}
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
                              {typeof activityData?.documentTitle ===
                                "string" && (
                                <p className="text-xs text-muted-foreground">
                                  Document:{" "}
                                  <span className="font-medium">
                                    {typeof activityData.documentTitle ===
                                      "string" ||
                                    typeof activityData.documentTitle ===
                                      "number"
                                      ? activityData.documentTitle
                                      : ""}
                                  </span>
                                </p>
                              )}

                              {/* User who performed the action */}
                              {(typeof activityData?.updatedBy === "string" ||
                                typeof activityData?.sharedBy === "string" ||
                                typeof activityData?.mentionedBy ===
                                  "string") && (
                                <p className="text-xs text-muted-foreground">
                                  By:{" "}
                                  {typeof activityData?.updatedBy === "string"
                                    ? activityData.updatedBy
                                    : typeof activityData?.sharedBy === "string"
                                    ? activityData.sharedBy
                                    : typeof activityData?.mentionedBy ===
                                      "string"
                                    ? activityData.mentionedBy
                                    : ""}
                                </p>
                              )}

                              {/* Permission change details */}
                              {notification.kind === "$documentAccess" &&
                                typeof activityData?.userType === "string" &&
                                !activityData?.isRemoval && (
                                  <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Access level:{" "}
                                    <span className="font-medium capitalize">
                                      {typeof activityData.userType ===
                                        "string" ||
                                      typeof activityData.userType === "number"
                                        ? activityData.userType
                                        : ""}
                                    </span>
                                    {typeof activityData?.previousUserType ===
                                      "string" && (
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
                                typeof activityData?.comment === "string" && (
                                  <p className="text-xs text-muted-foreground italic">
                                    &quot;
                                    {typeof activityData.comment === "string" ||
                                    typeof activityData.comment === "number"
                                      ? activityData.comment
                                      : ""}
                                    &quot;
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
                            isCustomNotification(notification)
                              ? (() => {
                                  const custom = notification;
                                  if (
                                    Array.isArray(custom.activities) &&
                                    typeof custom.activities[0]?.createdAt ===
                                      "string"
                                  ) {
                                    return custom.activities[0].createdAt;
                                  }
                                  if (
                                    Array.isArray(custom.activities) &&
                                    custom.activities[0]?.createdAt
                                  ) {
                                    return String(
                                      custom.activities[0].createdAt
                                    );
                                  }
                                  return undefined;
                                })()
                              : (() => {
                                  const notifiedAt = (
                                    notification as { notifiedAt?: unknown }
                                  ).notifiedAt;
                                  if (typeof notifiedAt === "string")
                                    return notifiedAt;
                                  if (notifiedAt instanceof Date)
                                    return notifiedAt.toISOString();
                                  return undefined;
                                })()
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
              onClick={async () => {
                await markAllAsRead();
                setIsOpen(false);
              }}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
