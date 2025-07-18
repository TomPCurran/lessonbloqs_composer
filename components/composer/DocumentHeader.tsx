"use client";

import React from "react";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import EditableTitle from "@/components/composer/EditableTitle";
import ActiveCollaborators from "@/components/lessonplans/ActiveCollaborators";

interface DocumentHeaderProps {
  documentId: string;
  initialTitle?: string;
  currentUserType: "creator" | "editor" | "viewer";
}

const DocumentHeader = ({
  documentId,
  initialTitle,
  currentUserType,
}: DocumentHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 w-full glass border-b border-border/50 py-grid-3">
      {/* Content container */}
      <div className="w-full flex flex-col items-center space-grid-3 animate-fade-in">
        {/* Title section */}
        <div className="w-full">
          <EditableTitle
            roomId={documentId}
            initialTitle={initialTitle}
            currentUserType={currentUserType}
          />
        </div>

        {/* Collaboration section */}
        <div className="flex items-center justify-center">
          <ClientSideSuspense
            fallback={
              <div className="text-body-small text-muted-foreground">
                Loading collaborators...
              </div>
            }
          >
            {() => <ActiveCollaborators />}
          </ClientSideSuspense>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;
