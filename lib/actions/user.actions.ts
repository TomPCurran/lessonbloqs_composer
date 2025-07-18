"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { liveblocks } from "../auth/liveblocks";
import { UserData } from "@/types";

export const getClerkUsers = async ({
  userIds,
}: {
  userIds: string[];
}): Promise<UserData[]> => {
  console.log("👥 [user.actions] getClerkUsers called", { userIds });

  try {
    // Check if userIds is empty or undefined
    if (!userIds || userIds.length === 0) {
      console.log(
        "👥 [user.actions] No userIds provided, returning empty array"
      );
      return [];
    }

    // Get the clerk client instance
    const clerk = await clerkClient();
    const { data } = await clerk.users.getUserList({
      userId: userIds,
    });

    console.log("👥 [user.actions] Clerk users fetched", {
      userCount: data.length,
    });

    const users = data.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      )?.emailAddress,
      imageUrl: user.imageUrl,
    }));

    // Filter out any users who couldn't be mapped properly
    const filteredUsers = users.filter((u) => u.email) as UserData[];
    console.log("👥 [user.actions] Returning filtered users", {
      originalCount: users.length,
      filteredCount: filteredUsers.length,
    });
    return filteredUsers;
  } catch (error) {
    console.error(`👥 [user.actions] Error fetching users: ${error}`);
    return [];
  }
};

export const getUserByEmail = async (
  email: string
): Promise<UserData | null> => {
  console.log("👥 [user.actions] getUserByEmail called", { email });

  try {
    const clerk = await clerkClient();

    // Search for users by email address
    const { data } = await clerk.users.getUserList({
      emailAddress: [email],
    });

    console.log("👥 [user.actions] User search result", {
      email,
      userCount: data.length,
    });

    if (data.length === 0) {
      console.log("👥 [user.actions] No user found for email", { email });
      return null;
    }

    // Get the first user (should be the only one for a unique email)
    const user = data[0];
    const userData: UserData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email:
        user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
          ?.emailAddress || email,
      imageUrl: user.imageUrl,
    };

    console.log("👥 [user.actions] Returning user data", {
      userId: userData.id,
      email: userData.email,
    });

    return userData;
  } catch (error) {
    console.error(`👥 [user.actions] Error fetching user by email: ${error}`);
    return null;
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string; // Now expects userId
  text: string;
}) => {
  const room = await liveblocks.getRoom(roomId);
  const userIds = Object.keys(room.usersAccesses).filter(
    (id) => id !== currentUser
  );

  return userIds.filter((id) =>
    text.length ? id.toLowerCase().includes(text.toLowerCase()) : true
  );
};

// export const getDocumentUsers = async ({
//   roomId,
//   currentUser,
//   text,
// }: {
//   roomId: string;
//   currentUser: string;
//   text: string;
// }) => {
//   try {
//     const room = await liveblocks.getRoom(roomId);

//     const users = Object.keys(room.usersAccesses).filter(
//       (email) => email !== currentUser
//     );

//     if (text.length) {
//       const lowerCaseText = text.toLowerCase();

//       const filteredUsers = users.filter((email: string) =>
//         email.toLowerCase().includes(lowerCaseText)
//       );

//       return filteredUsers;
//     }

//     return users;
//   } catch (error) {
//     console.error(`Error fetching document users: ${error}`);
//     return [];
//   }
// };
