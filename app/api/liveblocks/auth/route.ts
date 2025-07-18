import { liveblocks } from "@/lib/auth/liveblocks";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserColor } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    // Get the current user from Clerk
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Prefer firstName + lastName, fallback to fullName, fallback to email
    const name =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.fullName || user.emailAddresses[0]?.emailAddress || "Anonymous";

    // Generate a color for the user (use your getUserColor util)
    const color = getUserColor(user.id);

    // You can set userType based on your app's logic (default to 'editor' for now)
    const userType = "editor";

    // Create a session for the current user
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name,
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl || "",
        color,
        userType,
      },
    });

    // Give the user access to the room
    const { room } = await request.json();
    session.allow(room, session.FULL_ACCESS);

    // Return the session
    const { status, body } = await session.authorize();
    return new Response(body, { status });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
