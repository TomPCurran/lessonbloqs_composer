"use client";

import React, { memo, useMemo } from "react";
import Room from "@/components/Room";
import { UserData } from "@/types";

interface StableRoomProps {
  documentId: string;
  initialDocument: any;
  user: UserData;
  collaborators?: UserData[];
}

const StableRoom = memo(function StableRoom({
  documentId,
  initialDocument,
  user,
  collaborators = [],
}: StableRoomProps) {
  // **FIX**: Memoize user object to prevent recreation
  const stableUser = useMemo(
    () => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      email: user.email,
    }),
    [user.id, user.firstName, user.lastName, user.imageUrl, user.email]
  );

  // **FIX**: Memoize document object to prevent recreation
  const stableDocument = useMemo(
    () => ({
      id: initialDocument.id,
      metadata: {
        title: initialDocument.metadata?.title,
        creatorId: initialDocument.metadata?.creatorId,
        email: initialDocument.metadata?.email,
      },
      usersAccesses: initialDocument.usersAccesses,
      lastConnectionAt: initialDocument.lastConnectionAt,
      createdAt: initialDocument.createdAt,
    }),
    [
      initialDocument.id,
      initialDocument.metadata?.title,
      initialDocument.metadata?.creatorId,
      initialDocument.metadata?.email,
      initialDocument.usersAccesses,
      initialDocument.lastConnectionAt,
      initialDocument.createdAt,
    ]
  );

  // **FIX**: Memoize collaborators array
  const stableCollaborators = useMemo(
    () =>
      collaborators.map((collab) => ({
        id: collab.id,
        firstName: collab.firstName,
        lastName: collab.lastName,
        imageUrl: collab.imageUrl,
        email: collab.email,
      })),
    [collaborators]
  );

  console.log("📦 StableRoom rendering", { documentId });

  return (
    <Room
      documentId={documentId}
      initialDocument={stableDocument}
      user={stableUser}
      collaborators={stableCollaborators}
    />
  );
});

export default StableRoom;
