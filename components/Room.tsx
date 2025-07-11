"use client";

import { RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import Loader from "@/components/Loader";
import Canvas from "./composer/Canvas";
import { LiveObject, LiveList } from "@liveblocks/client";
import Link from "next/link";
import type { RoomProps } from "@/types";

const Room = ({ roomId, initialDocument, user, error }: RoomProps) => {
  // If there's an error, show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-16 space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {error === "You do not have access to this document"
              ? "Access Denied"
              : "Document Not Found"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {error === "You do not have access to this document"
              ? "You don't have permission to access this document."
              : "The document you're looking for doesn't exist or has been deleted."}
          </p>
          <Link
            href="/lessonplans"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  // If no document data, show loading state
  if (!initialDocument) {
    return (
      <div className="flex items-center justify-center h-full w-full py-16">
        <Loader /> Loading document...
      </div>
    );
  }
  const now = Date.now();

  const initialStorage = {
    lessonPlan: new LiveObject({
      title: initialDocument?.metadata?.title || "Untitled Lesson Plan",
      description: "",
      createdAt: now,
      updatedAt: now,
      creatorId: user.id,
    }),
    bloqs: new LiveList([]),
    settings: new LiveObject({
      allowComments: true,
      allowEditing: true,
      lastSaved: now,
    }),
  };

  const initialPresence = {
    cursor: null,
    activeBloqId: null,
    user: {
      name: `${user.firstName} ${user.lastName}`,
      color: "#000000",
      avatar: user.imageUrl,
    },
  };

  return (
    <RoomProvider
      id={roomId}
      initialStorage={initialStorage}
      initialPresence={initialPresence}
    >
      <ClientSideSuspense
        fallback={
          <div className="flex items-center justify-center h-full w-full py-16">
            <Loader /> Connecting to collaboration room...
          </div>
        }
      >
        <Canvas roomId={roomId} />
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;
