"use client";

import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import Canvas from "./composer/Canvas";
import { LiveObject, LiveList } from "@liveblocks/client";
import Link from "next/link";
import { RoomProps, UserData } from "@/types";
import { getUserColor } from "@/lib/utils";
import React from "react";

// A fallback component to show while the room is loading
const RoomLoader = () => (
  <div className="flex items-center justify-center h-full w-full py-16">
    <Loader /> Connecting to collaboration room...
  </div>
);

// An error component to show when access is denied or the document is not found
const RoomError = ({ error }: { error: string }) => (
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

interface RoomPropsFixed extends Omit<RoomProps, "collaborators"> {
  collaborators?: UserData[];
}

const Room = ({
  documentId,
  initialDocument,
  user,
  error,
  collaborators = [],
}: RoomPropsFixed) => {
  if (error) {
    return <RoomError error={error} />;
  }

  if (!initialDocument) {
    return <RoomLoader />;
  }

  // Define initial storage structure. This is only used if the room is new.
  const initialStorage = {
    lessonPlan: new LiveObject({
      title: initialDocument.metadata?.title || "Untitled Lesson Plan",
      description: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      creatorId: user.id,
    }),
    bloqs: new LiveList([]),
    settings: new LiveObject({
      allowComments: true,
      allowEditing: true,
      lastSaved: Date.now(),
    }),
  };

  // Define the user's initial presence.
  const initialPresence = {
    cursor: null,
    activeBloqId: null,
    user: {
      name: `${user.firstName} ${user.lastName}`,
      color: getUserColor(user.id),
      avatar: user.imageUrl,
    },
  };

  return (
    <RoomProvider
      id={documentId}
      initialStorage={initialStorage}
      initialPresence={initialPresence}
    >
      <ClientSideSuspense fallback={<RoomLoader />}>
        <Canvas
          documentId={documentId}
          currentUser={user as UserData} // Pass the full user object
          roomMetadata={initialDocument.metadata} // Pass metadata
          collaborators={collaborators}
        />
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;
