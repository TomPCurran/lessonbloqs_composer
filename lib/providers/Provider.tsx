"use client";

import React from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { getDocumentUsers } from "@/lib/actions/user.actions";
import { getUserColor } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import LessonbloqsLogoAnimated from "@/components/AnimatedLogo";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user: clerkUser } = useUser();

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks/auth"
      throttle={100}
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        const resolvedUsers = users.map((user) => ({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email || "",
          avatar: user.imageUrl,
          color: getUserColor(user.id),
          userType: "viewer" as const,
        }));


        return resolvedUsers;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        if (!roomId || !clerkUser?.id) {
          return [];
        }

        try {
          const mentionableUserIds = await getDocumentUsers({
            roomId,
            currentUser: clerkUser.id,
            text,
          });
          return mentionableUserIds;
        } catch (error) {
          console.error(error);
          return [];
        }
      }}
    >
      <ClientSideSuspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <LessonbloqsLogoAnimated />
          </div>
        }
      >
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;