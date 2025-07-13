"use server";

import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { liveblocks } from "@/lib/auth/liveblocks";
import { getAccessType, parseStringify } from "../utils";
import {
  CreateDocumentParams,
  RoomAccesses,
  ShareDocumentParams,
  AccessType,
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
      [email]: ["room:write"],
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
  try {
    const document = await liveblocks.getRoom(documentId);

    const hasAccess = Object.keys(document.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error("You do not have access to this document");
    }

    return parseStringify(document);
  } catch (error) {
    console.log(`Error happened while getting a room: ${error}`);
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
    console.log("Server: Updating document", { roomId, title });

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    console.log("Server: Document updated successfully");

    // Revalidate the lessonplans page since that's where the document list is shown
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

    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    if (updatedRoom) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email,
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

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while updating a room access: ${error}`);
    throw error;
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error("You cannot remove yourself from the document");
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while removing a collaborator: ${error}`);
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
