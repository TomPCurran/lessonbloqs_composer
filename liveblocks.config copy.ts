import { LiveObject, LiveList } from "@liveblocks/client";

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
      activeBloqId: string | null;
      user: {
        name: string;
        color: string;
        avatar?: string;
      };
    };

    Storage: {
      lessonPlan: LiveObject<{
        title: string;
        description?: string;
        createdAt: number;
        updatedAt: number;
        creatorId: string;
      }>;
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
        id: string;
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
      | { type: "SAVE_TRIGGERED" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    // ThreadMetadata: {
    //   bloqId: string;
    //   selectedText: string;
    //   timestamp: number;
    // };
    ThreadMetadata: Record<string, never>;
    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      title: string;
      creatorId: string;
      createdAt: number;
      updatedAt: number;
      userCount: number;
    };
  }
}

export {};
