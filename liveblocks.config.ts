import { LiveObject, LiveList } from "@liveblocks/client";

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // User's cursor position and selection in the editor
      cursor: { x: number; y: number } | null;
      // Which bloq the user is currently editing
      activeBloqId: string | null;
      // User's name and color for collaboration
      user: {
        name: string;
        color: string;
        avatar?: string;
      };
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Lesson plan metadata
      lessonPlan: LiveObject<{
        title: string;
        description?: string;
        createdAt: number;
        updatedAt: number;
        creatorId: string;
      }>;
      // Array of bloqs in the lesson plan
      bloqs: LiveList<
        LiveObject<{
          id: string;
          title: string;
          type: string;
          createdAt: number;
          updatedAt: number;
          order: number;
          content: string;
        }>
      >;
      // Collaboration settings
      settings: LiveObject<{
        allowComments: boolean;
        allowEditing: boolean;
        lastSaved: number;
      }>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        email: string;
        avatar?: string;
        color: string;
        userType: "creator" | "editor" | "viewer";
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent:
      | { type: "BLOQ_ADDED"; bloqId: string; position: number }
      | { type: "BLOQ_REMOVED"; bloqId: string }
      | {
          type: "BLOQ_MOVED";
          bloqId: string;
          fromIndex: number;
          toIndex: number;
        }
      | { type: "USER_JOINED"; userId: string; userName: string }
      | { type: "USER_LEFT"; userId: string; userName: string }
      | { type: "SAVE_TRIGGERED" }
      | { type: "COMMENT_ADDED"; bloqId: string; threadId: string }
      | { type: "COMMENT_RESOLVED"; bloqId: string; threadId: string };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      bloqId: string;
      position?: { x: number; y: number };
      type: "comment" | "suggestion"; // Add different comment types
      resolved?: boolean;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      title: string;
      creatorId: string;
      createdAt: number;
      updatedAt: number;
      userCount: number;
    };

    // Activities for inbox notifications - Updated to match what we're actually sending
    Activities: {
      // Document access notification
      $documentAccess: {
        userType: "creator" | "editor" | "viewer" | "removed";
        previousUserType?: string;
        title: string;
        updatedBy: string;
        updatedByAvatar?: string;
        updatedByEmail: string;
        documentTitle: string;
        documentId: string;
        isNewShare?: boolean;
        isRemoval?: boolean;
        timestamp: string;
        customMessage: string;
      };
      // Document shared notification
      $documentShared: {
        documentTitle: string;
        documentId: string;
        sharedBy: string;
        sharedByAvatar?: string;
        sharedByEmail: string;
        accessType: "viewer" | "editor";
        timestamp: string;
        customMessage: string;
      };
      // Comment notification
      $documentComment: {
        bloqId: string;
        comment: string;
        mentionedBy: string;
        mentionedByAvatar?: string;
        mentionedByEmail: string;
        documentTitle: string;
        documentId: string;
        timestamp: string;
        customMessage: string;
      };
    };
  }
}

export {};
