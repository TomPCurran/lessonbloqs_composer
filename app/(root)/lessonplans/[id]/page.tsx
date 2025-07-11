import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SearchParamProps } from "@/types";
import Room from "@/components/Room";
import { getDocument } from "@/lib/actions/room.actions";

const Page = async ({ params }: SearchParamProps) => {
  const resolvedParams = await params;
  const roomId = resolvedParams?.id as string;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Extract only the necessary user data for client component
  const userData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0].emailAddress,
  };

  // Check if room exists and user has access
  let document;
  let error: string | null = null;

  try {
    document = await getDocument({
      roomId: roomId,
      userId: user.emailAddresses[0].emailAddress,
    });
  } catch (err) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = "Failed to load document";
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full pt-16 px-4 sm:px-6 lg:px-8">
      <Room
        roomId={roomId}
        initialDocument={document}
        user={userData}
        error={error}
      />
    </main>
  );
};

export default Page;
