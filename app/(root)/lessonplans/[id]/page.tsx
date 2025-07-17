import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Room from "@/components/Room";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { UserData } from "@/types";

interface PageProps {
  params: {
    id: string;
  };
}

const DocumentErrorState = ({
  title = "Something went wrong",
  message = "We encountered an error while loading your document. Please try again later.",
  actionLabel = "Go back",
  onAction,
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="main-layout">
    <div className="content-area">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="google-card p-grid-6 max-w-lg w-full text-center space-grid-4">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-grid-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div className="space-grid-2">
            <h1 className="text-headline-large text-foreground">{title}</h1>
            <p className="text-body-large text-muted-foreground">{message}</p>
          </div>

          {onAction && (
            <button
              onClick={onAction}
              className="google-button-primary mt-grid-2"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const documentId = resolvedParams?.id;

  if (!documentId) {
    return (
      <DocumentErrorState
        title="Invalid Document"
        message="The document identifier is missing. Please check the URL and try again."
        actionLabel="Go to Documents"
        onAction={() => redirect("/lessonplans")}
      />
    );
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  try {
    const room = await getDocument({
      documentId,
      userId: clerkUser.id,
    });

    if (!room) {
      redirect("/lessonplans");
    }

    const userIds = Object.keys(room.usersAccesses);
    const users = await getClerkUsers({ userIds });

    const collaborators = users
      .filter(
        (user): user is UserData & { name: string; avatar: string } => !!user
      )
      .map((user) => ({
        ...user,
        userType: room.usersAccesses[user.id]?.[0],
      }));

    const currentUserData: UserData = {
      id: clerkUser.id,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      imageUrl: clerkUser.imageUrl,
      email: clerkUser.emailAddresses[0].emailAddress,
    };

    return (
      <div className="main-layout">
        <main className="content-area min-h-screen">
          <div className="mx-auto max-w-7xl px-grid-2 py-grid-3 sm:px-grid-3 lg:px-grid-4">
            <div className="google-card p-0 overflow-hidden animate-fade-in">
              <Room
                documentId={documentId}
                initialDocument={room}
                user={currentUserData}
                collaborators={collaborators}
              />
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching document:", error);

    if (error instanceof Error && error.message === "ACCESS_DENIED") {
      redirect("/lessonplans");
    }

    return (
      <DocumentErrorState
        title="Failed to load document"
        message="We encountered an error while loading your document. This might be a temporary issue."
        actionLabel="Try again"
        onAction={() => window.location.reload()}
      />
    );
  }
};

export default Page;
