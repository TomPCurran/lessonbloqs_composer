import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SearchParamProps, UserData } from "@/types";
import Room from "@/components/Room";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { getUserColor } from "@/lib/utils";
import { UserType } from "@/types";

const Page = async ({ params }: SearchParamProps) => {
  const resolvedParams = await params;
  const documentId = resolvedParams?.id as string;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const document = await getDocument({
    documentId: documentId,
    userId: user.emailAddresses[0].emailAddress,
  });

  console.log(`Document: ${document}`);

  if (!document) {
    redirect("/lessonplans");
  }

  const userIds = Object.keys(document?.usersAccesses);
  const users = await getClerkUsers({ userIds });

  const collaborators =
    users && Array.isArray(users)
      ? users
          .filter(
            (
              user
            ): user is {
              id: string;
              name: string;
              email: string;
              avatar: string;
            } => user !== undefined && user !== null
          )
          .map((user) => ({
            ...user,
            color: getUserColor(user.id),
            userType: (document.usersAccesses[user.email]?.includes(
              "room:write"
            )
              ? "editor"
              : "viewer") as UserType,
          }))
      : [];

  const currentUserType = (
    document.usersAccesses[user.emailAddresses[0].emailAddress]?.includes(
      "room:write"
    )
      ? "editor"
      : "viewer"
  ) as UserType;

  // Convert Clerk user to plain object for client component
  const userData: UserData = {
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0].emailAddress,
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full pt-16 px-4 sm:px-6 lg:px-8">
      <Room
        documentId={documentId}
        initialDocument={document}
        collaborators={collaborators}
        documentMetadata={document.metadata}
        currentUserType={currentUserType}
        user={userData}
      />
    </main>
  );
};

export default Page;
