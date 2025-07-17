"use client";

import { LiveblocksProvider } from "@liveblocks/react/suspense";
import React from "react";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { getDocumentUsers } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { getUserColor } from "@/lib/utils";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user: clerkUser } = useUser();

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks/auth"
      resolveUsers={async ({ userIds }) => {
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
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: clerkUser?.emailAddresses[0]?.emailAddress || "",
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
