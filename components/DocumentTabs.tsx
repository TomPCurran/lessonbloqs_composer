"use client";

import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentStore } from "@/lib/stores/documentStore";
import LessonPlanList from "@/components/LessonPlanList";

// NOTE: These should be DocumentDataWithOwner[] if types are available
interface DocumentTabsProps {
  myDocuments: any[];
  sharedDocuments: any[];
}

export default function DocumentTabs({
  myDocuments,
  sharedDocuments,
}: DocumentTabsProps) {
  // Use Zustand document store
  const { documents, setDocuments } = useDocumentStore();

  // Initialize documents when props change
  useEffect(() => {
    const allDocuments = [...myDocuments, ...sharedDocuments];
    setDocuments(allDocuments);
  }, [myDocuments, sharedDocuments, setDocuments]);

  // Split documents by ownership
  const myDocs = documents.filter((doc) => doc.currentUserType === "creator");
  const sharedDocs = documents.filter(
    (doc) => doc.currentUserType !== "creator"
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs defaultValue="my-documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="my-documents">
            My Documents ({myDocs.length})
          </TabsTrigger>
          <TabsTrigger value="shared-documents">
            Shared ({sharedDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-documents" className="mt-6">
          <LessonPlanList documents={myDocs} />
        </TabsContent>

        <TabsContent value="shared-documents" className="mt-6">
          <LessonPlanList documents={sharedDocs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
