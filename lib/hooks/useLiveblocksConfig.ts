"use client";

import { useCallback } from "react";
import { getClerkUsers } from "@/lib/actions/user.actions";

export function useLiveblocksConfig() {
  const resolveUsers = useCallback(async (userIds: string[]) => {
    const users = await getClerkUsers({ userIds });
    return users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`, // Changed from 'username' to 'name'
      avatarUrl: user.imageUrl,
    }));
  }, []);

  return { resolveUsers };
}
