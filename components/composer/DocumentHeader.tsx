"use client";

import React from "react";
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
    <div className="sticky top-0 z-50 w-full flex flex-col items-center mb-grid-4 bg-background/95 backdrop-blur-sm border-b border-border/50 py-4">
      {/* Title and collaboration info - centered */}
      <div className="w-full flex flex-col items-center animate-fade-in">
        <EditableTitle
          roomId={documentId}
          initialTitle={initialTitle}
          currentUserType={currentUserType}
        />
        <ActiveCollaborators />
      </div>
    </div>
  );
};

export default DocumentHeader;
