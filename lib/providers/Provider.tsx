"use client";

import React from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { getDocumentUsers } from "@/lib/actions/user.actions";
import { getUserColor } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user: clerkUser } = useUser();

  console.log("🌐 [Global Provider] Setting up LiveblocksProvider", {
    hasUser: !!clerkUser,
    userId: clerkUser?.id,
  });

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks/auth"
      throttle={100}
      resolveUsers={async ({ userIds }) => {
        console.log("🌐 [Global Provider] Resolving users:", { userIds });
        const users = await getClerkUsers({ userIds });
        return users.map((user) => ({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email || "",
          avatar: user.imageUrl,
          color: getUserColor(user.id),
          userType: "editor" as const,
        }));
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        console.log("🌐 [Global Provider] Resolving mention suggestions:", {
          text,
          roomId,
        });
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: clerkUser?.id || "",
          text,
        });
        return roomUsers;
      }}
    >
      {children}
    </LiveblocksProvider>
  );
};

export default Provider;
