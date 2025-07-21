"use server";

import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { liveblocks } from "@/lib/auth/liveblocks";
import { getAccessType, parseStringify } from "../utils";
import { getUserByEmail } from "@/lib/actions/user.actions";
import {
  CreateDocumentParams,
  RoomAccesses,
  ShareDocumentParams,
  AccessType,
  User,
} from "@/types";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = uuidv4();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [userId]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while creating a room: ${error}`);
    throw error; // Re-throw the error so we can handle it properly
  }
};

export const getDocument = async ({
  documentId,
  userId,
}: {
  documentId: string;
  userId: string;
}) => {
  console.log("🏢 [room.actions] getDocument called", { documentId, userId });

  try {
    const document = await liveblocks.getRoom(documentId);
    console.log("🏢 [room.actions] Room fetched", {
      roomId: document.id,
      hasMetadata: !!document.metadata,
      userCount: Object.keys(document.usersAccesses).length,
    });

    const hasAccess = Object.keys(document.usersAccesses).includes(userId);
    console.log("🏢 [room.actions] Access check", { hasAccess, userId });

    if (!hasAccess) {
      console.log("🏢 [room.actions] Access denied");
      throw new Error("ACCESS_DENIED");
    }

    console.log("🏢 [room.actions] Returning document");
    return parseStringify(document);
  } catch (error) {
    console.log(
      `🏢 [room.actions] Error happened while getting a room: ${error}`
    );
    // Re-throw the error so we can handle it properly in the calling component
    throw error;
  }
};
export const checkRoomExists = async (roomId: string) => {
  try {
    await liveblocks.getRoom(roomId);
    return true;
  } catch {
    return false;
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath("/lessonplans");
    revalidatePath(`/lessonplans/${roomId}`);

    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while updating a room: ${error}`);
    throw error; // Re-throw the error so we can handle it properly
  }
};

export const getDocuments = async (email: string) => {
  try {
    const response = await liveblocks.getRooms({ userId: email });
    const parsedResponse = parseStringify(response);

    // Return the data array from the response
    return parsedResponse.data || [];
  } catch (error) {
    console.log(`Error happened while getting rooms: ${error}`);
    throw error; // Re-throw the error so we can handle it properly
  }
};

export const getRoomUsers = async (roomId: string) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    return {
      usersAccesses: room.usersAccesses,
      metadata: room.metadata,
    };
  } catch (error) {
    console.log(`Error happened while getting room users: ${error}`);
    throw error;
  }
};

export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    const currentUserEmail = updatedBy.email;
    const isSelf = email === currentUserEmail;
    const isOwner = room.metadata.creatorId === updatedBy.id;
    const isViewer = updatedBy.userType === "viewer";
    const isEditor = updatedBy.userType === "editor";

    // Viewers cannot change any permissions (including their own)
    if (isViewer) {
      throw new Error("Viewers cannot change permissions.");
    }
    // Editors/Owners cannot change their own permissions
    if (isSelf && (isEditor || isOwner)) {
      throw new Error("You cannot change your own permissions.");
    }

    // Get the user by email to get their userId
    const targetUser = await getUserByEmail(email);
    if (!targetUser) {
      throw new Error(
        "User not found. Please make sure the email address is correct and the user has an account."
      );
    }

    // Use userId as the key instead of email
    const usersAccesses: RoomAccesses = {
      [targetUser.id]: getAccessType(userType) as AccessType,
    };

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    if (updatedRoom) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: targetUser.id, // Changed from email to targetUser.id
        kind: "$documentAccess",
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId,
      });
    }
    // Only revalidate the lessonplans page, not the individual document page
    // to prevent connection disruptions during sharing
    revalidatePath(`/lessonplans`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while updating a room access: ${error}`);
    throw error;
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
  removedBy,
}: {
  roomId: string;
  email: string;
  removedBy: User;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    // Get the user by email to get their userId
    const targetUser = await getUserByEmail(email);
    if (!targetUser) {
      throw new Error(
        "User not found. Please make sure the email address is correct."
      );
    }

    // Check if the user exists in the room using userId
    if (!room.usersAccesses[targetUser.id]) {
      throw new Error("User does not have access to this document");
    }

    // Prevent removing the document creator
    if (targetUser.id === room.metadata.creatorId) {
      throw new Error("Cannot remove the document creator");
    }

    // Prevent removing yourself
    if (email === removedBy.email) {
      throw new Error("You cannot remove yourself from the document");
    }

    // Check if the user doing the removal has permission
    const currentUserAccess = room.usersAccesses[removedBy.id];
    if (
      !currentUserAccess ||
      !currentUserAccess.some((access) => access === "room:write")
    ) {
      throw new Error(
        "You don't have permission to remove users from this document"
      );
    }

    // Remove the user's access by setting it to null using userId
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [targetUser.id]: null,
      },
    });

    if (updatedRoom) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: targetUser.id, // Changed from email to targetUser.id
        kind: "$documentAccess",
        subjectId: notificationId,
        activityData: {
          userType: "removed",
          title: `You have been removed from the document by ${removedBy.name}`,
          updatedBy: removedBy.name,
          avatar: removedBy.avatar,
          email: removedBy.email,
        },
        roomId,
      });
    }
    // Revalidate the page to reflect changes
    revalidatePath(`/lessonplans/${roomId}`);
    revalidatePath(`/lessonplans`);

    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while removing a collaborator: ${error}`);
    throw error; // Re-throw the error so the UI can handle it
  }
};

export const deleteDocument = async (roomId: string, userId: string) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    if (room.metadata.creatorId !== userId) {
      throw new Error("Only the creator can delete this document.");
    }
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    // Removed redirect("/"); so the UI does not navigate away after deletion
  } catch (error) {
    console.log(`Error happened while deleting a room: ${error}`);
    throw error;
  }
};
