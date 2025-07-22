import { liveblocks } from "@/lib/auth/liveblocks";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserColor } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 [Liveblocks Auth] Starting authentication...");

    // Get the current user from Clerk
    const { userId } = await auth();
    const user = await currentUser();

    console.log("🔐 [Liveblocks Auth] User info:", {
      userId,
      hasUser: !!user,
      email: user?.emailAddresses[0]?.emailAddress,
    });

    if (!userId || !user) {
      console.log("🔐 [Liveblocks Auth] Unauthorized - no user found");
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
      console.log(
        "🔐 [Liveblocks Auth] Authenticating for user-level access (notifications)"
      );
      // For inbox notifications, we don't need to grant access to any specific room
      // The session will be used to fetch user's notifications across all rooms they have access to
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

// import { liveblocks } from "@/lib/auth/liveblocks";
// import { NextRequest } from "next/server";
// import { auth, currentUser } from "@clerk/nextjs/server";
// import { getUserColor } from "@/lib/utils";

// export async function POST(request: NextRequest) {
//   try {
//     console.log("🔐 [Liveblocks Auth] Starting authentication...");

//     // Get the current user from Clerk
//     const { userId } = await auth();
//     const user = await currentUser();

//     console.log("🔐 [Liveblocks Auth] User info:", {
//       userId,
//       hasUser: !!user,
//       email: user?.emailAddresses[0]?.emailAddress,
//     });

//     if (!userId || !user) {
//       console.log("🔐 [Liveblocks Auth] Unauthorized - no user found");
//       return new Response("Unauthorized", { status: 401 });
//     }

//     // Parse the request body
//     const body = await request.json();
//     console.log("🔐 [Liveblocks Auth] Request body:", body);

//     // Extract room from the request
//     const { room } = body;
//     console.log("🔐 [Liveblocks Auth] Room access request:", { room });

//     // Validate room parameter
//     if (!room || typeof room !== "string") {
//       console.error("🔐 [Liveblocks Auth] Invalid room parameter:", {
//         room,
//         type: typeof room,
//       });
//       return new Response("Invalid room parameter", { status: 400 });
//     }

//     // Prefer firstName + lastName, fallback to fullName, fallback to email
//     const name =
//       user.firstName && user.lastName
//         ? `${user.firstName} ${user.lastName}`
//         : user.fullName || user.emailAddresses[0]?.emailAddress || "Anonymous";

//     // Generate a color for the user (use your getUserColor util)
//     const color = getUserColor(user.id);

//     // You can set userType based on your app's logic (default to 'editor' for now)
//     const userType = "editor";

//     // Create a session for the current user
//     const session = liveblocks.prepareSession(userId, {
//       userInfo: {
//         name,
//         email: user.emailAddresses[0]?.emailAddress || "",
//         avatar: user.imageUrl || "",
//         color,
//         userType,
//       },
//     });

//     // Give the user access to the room
//     session.allow(room, session.FULL_ACCESS);

//     // Return the session
//     const { status, body: responseBody } = await session.authorize();
//     console.log("🔐 [Liveblocks Auth] Session authorized:", { status });
//     return new Response(responseBody, { status });
//   } catch (error) {
//     console.error("Liveblocks auth error:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }
