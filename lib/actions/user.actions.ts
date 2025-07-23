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
  currentUser: string; // Current user's ID
  text: string; // Search text
}) => {
  try {
    // Get the room to access all users
    const room = await liveblocks.getRoom(roomId);

    // Get all user IDs except current user
    const userIds = Object.keys(room.usersAccesses).filter(
      (id) => id !== currentUser
    );

    // If no userIds, return empty array
    if (userIds.length === 0) {
      return [];
    }

    // Get user details from Clerk
    const users = await getClerkUsers({ userIds });

    // Filter users based on search text
    if (text.length > 0) {
      const lowerCaseText = text.toLowerCase();

      const filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email?.toLowerCase() || "";

        return (
          fullName.includes(lowerCaseText) ||
          email.includes(lowerCaseText) ||
          user.firstName?.toLowerCase().includes(lowerCaseText) ||
          user.lastName?.toLowerCase().includes(lowerCaseText)
        );
      });

      // Return user IDs of filtered users
      return filteredUsers.map((user) => user.id);
    }

    // If no search text, return all user IDs
    return userIds;
  } catch (error) {
    console.error(`Error fetching document users: ${error}`);
    return [];
  }
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
