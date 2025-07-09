import { liveblocks } from "@/lib/auth/liveblocks";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Get the current user from Clerk
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Create a session for the current user
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: user?.fullName || "Anonymous",
        email: user?.emailAddresses[0]?.emailAddress || "",
        avatar: user?.imageUrl || "",
        color: "#6B4CE6", // You can generate this dynamically
        userType: "editor", // You can determine this based on room permissions
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
