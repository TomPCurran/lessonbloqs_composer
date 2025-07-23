import { liveblocks } from "@/lib/auth/liveblocks";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserColor } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {

    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    console.log("🔐 [Liveblocks Auth] Request body:", body);

    // Extract room from the request (may be undefined for inbox notifications)
    const { room } = body;
    console.log("🔐 [Liveblocks Auth] Room access request:", { room });

    // Prefer firstName + lastName, fallback to fullName, fallback to email
    const name =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.fullName || user.emailAddresses[0]?.emailAddress || "Anonymous";

    // Generate a color for the user (use your getUserColor util)
    const color = getUserColor(userId);
    console.log("🔐 [Liveblocks Auth] User color:", color);

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

    // Handle two cases:
    // 1. Room-specific authentication (when room is provided)
    // 2. User-only authentication (for inbox notifications)
    if (room && typeof room === "string") {
      // Room-specific authentication
      console.log(
        "🔐 [Liveblocks Auth] Authenticating for specific room:",
        room
      );
      session.allow(room, session.FULL_ACCESS);
    } else {
      // User-only authentication for inbox notifications
        }

    // Return the session
    const { status, body: responseBody } = await session.authorize();
    console.log("🔐 [Liveblocks Auth] Session authorized:", {
      status,
      hasRoom: !!room,
    });
    return new Response(responseBody, { status });
  } catch (error) {
    console.error("🔐 [Liveblocks Auth] Authentication error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
