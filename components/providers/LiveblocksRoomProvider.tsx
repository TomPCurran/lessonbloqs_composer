"use client";

import { ReactNode, useRef } from "react";
import { RoomProvider } from "@liveblocks/react";
import { LiveObject, LiveList } from "@liveblocks/client";

interface LiveblocksRoomProviderProps {
  children: ReactNode;
  documentId: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    color: string;
  };
  initialTitle: string;
  creatorId: string;
}

export function LiveblocksRoomProvider({
  children,
  documentId,
  user,
  initialTitle,
  creatorId,
}: LiveblocksRoomProviderProps) {
  const staticTimestamp = useRef(Date.now());

  const initialStorage = useRef({
    lessonPlan: new LiveObject({
      title: initialTitle,
      description: "",
      createdAt: staticTimestamp.current,
      updatedAt: staticTimestamp.current,
      creatorId,
    }),
    bloqs: new LiveList([]),
    settings: new LiveObject({
      allowComments: true,
      allowEditing: true,
      lastSaved: staticTimestamp.current,
    }),
  });

  const initialPresence = {
    cursor: null,
    activeBloqId: null,
    user: {
      name: user.name,
      color: user.color,
      avatar: user.avatar,
    },
  };

  return (
    <RoomProvider
      id={documentId}
      initialStorage={initialStorage.current}
      initialPresence={initialPresence}
    >
      {children}
    </RoomProvider>
  );
}
