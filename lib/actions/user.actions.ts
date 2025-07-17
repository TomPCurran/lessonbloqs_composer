"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { liveblocks } from "../auth/liveblocks";
import { UserData } from "@/types";

export const getClerkUsers = async ({
  userIds,
}: {
  userIds: string[];
}): Promise<UserData[]> => {
  try {
    // Check if userIds is empty or undefined
    if (!userIds || userIds.length === 0) {
      return [];
    }

    // Get the clerk client instance
    const clerk = await clerkClient();
    const { data } = await clerk.users.getUserList({
      userId: userIds,
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
    return users.filter((u) => u.email) as UserData[];
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    return [];
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
