import React, { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { List } from "lucide-react";
import AddDocumentBtn from "@/components/AddDocumentButton";
import { getDocuments } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import UploadButton from "@/components/LessonPlanUpload";
import DocumentTabs from "@/components/DocumentTabs";
import { LessonbloqsLogoAnimated } from "@/components/AnimatedLogo";
import { DocumentDataWithOwner } from "@/types";
import { ZustandTest } from "@/components/ui/zustand-test";
import Notification from "@/components/notifications/Notification";
async function DocumentsData() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const documents = await getDocuments(user.id);
  const ownerIds = documents.map(
    (doc: { metadata: { creatorId: string } }) => doc.metadata.creatorId
  );
  const owners = await getClerkUsers({
    userIds: [...new Set(ownerIds)] as string[],
  });

  const documentsWithOwner: DocumentDataWithOwner[] = documents.map(
    (doc: {
      id: string;
      metadata: { creatorId: string; title: string };
      usersAccesses: Record<string, string[]>;
      lastConnectionAt?: string;
      createdAt?: string;
    }) => {
      const owner = owners.find((o) => o.id === doc.metadata.creatorId);
      return {
        ...doc,
        ownerName: owner
          ? `${owner.firstName || ""} ${owner.lastName || ""}`.trim()
          : "Unknown",
        collaborators: [], // This can be populated if needed for the share modal
        currentUserType:
          doc.metadata.creatorId === user.id
            ? "creator"
            : doc.usersAccesses?.[user.id]?.[0] === "room:write"
            ? "editor"
            : "viewer",
        currentUser: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.emailAddresses[0].emailAddress,
          imageUrl: user.imageUrl,
        },
      };
    }
  );

  const myDocuments = documentsWithOwner
    .filter((doc) => doc.metadata.creatorId === user.id)
    .sort(
      (a, b) =>
        new Date(b.lastConnectionAt || b.createdAt || Date.now()).getTime() -
        new Date(a.lastConnectionAt || a.createdAt || Date.now()).getTime()
    );

  const sharedDocuments = documentsWithOwner
    .filter((doc) => doc.metadata.creatorId !== user.id)
    .sort(
      (a, b) =>
        new Date(b.lastConnectionAt || b.createdAt || Date.now()).getTime() -
        new Date(a.lastConnectionAt || a.createdAt || Date.now()).getTime()
    );

  return (
    <DocumentTabs myDocuments={myDocuments} sharedDocuments={sharedDocuments} />
  );
}

// The main page component, now cleaner and using Suspense.
const LessonPlansPage = () => {
  return (
    <div className="container mx-auto p-8 space-y-6">
      <Notification />
      <Card className="bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex items-center gap-3">
          <List className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Your Lesson Plans
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <AddDocumentBtn />
          <UploadButton />
        </div>
      </Card>

      <Suspense fallback={<LessonbloqsLogoAnimated />}>
        <DocumentsData />
      </Suspense>

      <ZustandTest />
    </div>
  );
};

export default LessonPlansPage;
