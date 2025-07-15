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

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const documentId = resolvedParams?.id;

  if (!documentId) {
    // Handle the case where id is not present, though this is unlikely in a dynamic route
    return <div>Document ID not found.</div>;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  try {
    const room = await getDocument({
      documentId,
      userId: clerkUser.emailAddresses[0].emailAddress,
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
        userType: room.usersAccesses[user.email as string]?.[0],
      }));

    const currentUserData: UserData = {
      id: clerkUser.id,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      imageUrl: clerkUser.imageUrl,
      email: clerkUser.emailAddresses[0].emailAddress,
    };

    return (
      <main className="flex-1 flex flex-col items-center justify-center w-full pt-16 px-4 sm:px-6 lg:px-8">
        <Room
          documentId={documentId}
          initialDocument={room}
          user={currentUserData}
          collaborators={collaborators}
        />
      </main>
    );
  } catch (error) {
    console.error("Error fetching document:", error);
    return <div>Error loading document. Please try again later.</div>;
  }
};

export default Page;
