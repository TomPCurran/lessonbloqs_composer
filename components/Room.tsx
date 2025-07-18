"use client";

import { RoomProvider } from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import Canvas from "./composer/Canvas";
import { LiveObject, LiveList } from "@liveblocks/client";
import Link from "next/link";
import { RoomProps, UserData } from "@/types";
import { getUserColor } from "@/lib/utils";
import React from "react";

import { FloatingToolbar } from "@/components/composer/FloatingToolbar";
import { AlertCircle, FileX } from "lucide-react";

// Material Design loading component
const RoomLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="google-card p-grid-6 max-w-md w-full text-center space-grid-3">
      <div className="animate-pulse">
        <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-grid-3">
          <Loader />
        </div>
        <div className="h-3 bg-muted rounded-full w-3/4 mx-auto mb-grid-2"></div>
        <div className="h-3 bg-muted rounded-full w-1/2 mx-auto mb-grid-3"></div>
        <div className="h-2 bg-muted rounded-full w-full mb-2"></div>
        <div className="h-2 bg-muted rounded-full w-5/6"></div>
      </div>
      <p className="text-body-medium text-muted-foreground">
        Connecting to collaboration room...
      </p>
    </div>
  </div>
);

// Material Design error component
const RoomError = ({ error }: { error: string }) => (
  <div className="main-layout">
    <div className="content-area">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="google-card p-grid-6 max-w-lg w-full text-center space-grid-4">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-grid-4 rounded-full bg-destructive/10 flex items-center justify-center">
            {error === "ACCESS_DENIED" ? (
              <AlertCircle className="w-8 h-8 text-destructive" />
            ) : (
              <FileX className="w-8 h-8 text-destructive" />
            )}
          </div>

          <div className="space-grid-2">
            <h2 className="text-headline-large text-foreground">
              {error === "ACCESS_DENIED"
                ? "Access Denied"
                : "Document Not Found"}
            </h2>
            <p className="text-body-large text-muted-foreground">
              {error === "ACCESS_DENIED"
                ? "You don't have permission to access this document."
                : "The document you're looking for doesn't exist or has been deleted."}
            </p>
          </div>

          <Link
            href="/lessonplans"
            className="google-button-primary inline-flex mt-grid-2"
          >
            Back to Documents
          </Link>
        </div>
      </div>
    </div>
  </div>
);

interface RoomPropsFixed extends Omit<RoomProps, "collaborators"> {
  collaborators?: UserData[];
}

const Room = React.memo(function Room({
  documentId,
  initialDocument,
  user,
  error,
}: RoomPropsFixed) {
  console.log("🏠 [Room] Rendering Room component", {
    documentId,
    hasInitialDocument: !!initialDocument,
    userId: user?.id,
    error,
  });

  if (error) {
    console.log("🏠 [Room] Error state", { error });
    return <RoomError error={error} />;
  }

  if (!initialDocument) {
    console.log("🏠 [Room] No initial document, showing loader");
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
    console.log("🏠 [Room] Computing user type", {
      userId: user.id,
      creatorId: initialDocument?.metadata?.creatorId,
      userAccess: initialDocument?.usersAccesses?.[user.id],
    });

    // Check if user is the creator
    if (initialDocument?.metadata?.creatorId === user.id) {
      console.log("🏠 [Room] User is creator");
      return "creator";
    }

    // Check user's access permissions from Liveblocks
    const userAccess = initialDocument?.usersAccesses?.[user.id];

    if (userAccess) {
      // If user has room:write access, they're an editor
      if (userAccess.includes("room:write")) {
        console.log("🏠 [Room] User is editor");
        return "editor";
      }
      // If user has room:read access, they're a viewer
      if (userAccess.includes("room:read")) {
        console.log("🏠 [Room] User is viewer");
        return "viewer";
      }
    }

    // Default to viewer if no access found
    console.log("🏠 [Room] User type defaulting to viewer");
    return "viewer";
  })();

  console.log("🏠 [Room] Setting up RoomProvider", {
    documentId,
    currentUserType,
    initialStorageKeys: Object.keys(initialStorage),
    initialPresence: initialPresence.user,
  });

  return (
    <RoomProvider
      id={documentId}
      initialStorage={initialStorage}
      initialPresence={initialPresence}
    >
      <div className="main-layout min-h-screen animate-fade-in">
        {/* <DocumentHeader
          documentId={documentId}
          initialTitle={initialDocument.metadata?.title}
          currentUserType={currentUserType}
        /> */}

        {/* Main Content Area */}
        <div className="content-area">
          <div className="mx-auto max-w-6xl px-grid-2 py-grid-3 sm:px-grid-3 lg:px-grid-4 space-grid-4">
            {/* Floating Toolbar */}
            <div className="flex justify-center">
              <FloatingToolbar
                roomId={documentId}
                currentUserType={currentUserType}
                roomMetadata={initialDocument.metadata}
                currentUser={user as UserData}
              />
            </div>

            {/* Canvas Container */}
            <div className="google-card p-0 overflow-hidden">
              <Canvas
                currentUser={user as UserData}
                currentUserType={currentUserType}
              />
            </div>
          </div>
        </div>
      </div>
    </RoomProvider>
  );
});

export default Room;
