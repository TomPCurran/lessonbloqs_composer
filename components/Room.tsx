"use client";

import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import Canvas from "./composer/Canvas";
import { LiveObject, LiveList } from "@liveblocks/client";
import Link from "next/link";
import { RoomProps, UserData } from "@/types";
import { getUserColor } from "@/lib/utils";
import React from "react";
import DocumentHeader from "@/components/composer/DocumentHeader";
import { FloatingToolbar } from "@/components/composer/FloatingToolbar";

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
        {error === "ACCESS_DENIED" ? "Access Denied" : "Document Not Found"}
      </h2>
      <p className="text-muted-foreground mb-4">
        {error === "ACCESS_DENIED"
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

const Room = ({ documentId, initialDocument, user, error }: RoomPropsFixed) => {
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

  // Compute currentUserType based on user's access
  const currentUserType = (() => {
    // Check if user is the creator
    if (initialDocument?.metadata?.creatorId === user.id) {
      return "creator";
    }

    // Check user's access permissions from Liveblocks
    const userAccess = initialDocument?.usersAccesses?.[user.email];

    if (userAccess) {
      // If user has room:write access, they're an editor
      if (userAccess.includes("room:write")) {
        return "editor";
      }
      // If user has room:read access, they're a viewer
      if (userAccess.includes("room:read")) {
        return "viewer";
      }
    }

    // Default to viewer if no access found
    return "viewer";
  })();

  return (
    <RoomProvider
      id={documentId}
      initialStorage={initialStorage}
      initialPresence={initialPresence}
    >
      <ClientSideSuspense fallback={<RoomLoader />}>
        {/* --- Always show the editable header at the top --- */}
        <DocumentHeader
          documentId={documentId}
          initialTitle={initialDocument.metadata?.title}
          currentUserType={currentUserType}
        />

        {/* Floating Toolbar - scrolls with content */}
        <div className="flex justify-center mb-grid-4">
          <FloatingToolbar
            roomId={documentId}
            currentUserType={currentUserType}
            roomMetadata={initialDocument.metadata}
            currentUser={user as UserData}
          />
        </div>

        <Canvas
          documentId={documentId}
          currentUser={user as UserData}
          currentUserType={currentUserType}
        />
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;
