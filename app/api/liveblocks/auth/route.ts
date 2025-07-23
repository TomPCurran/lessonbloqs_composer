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

    const body = await request.json();
    const { room } = body;
    const name =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.fullName || user.emailAddresses[0]?.emailAddress || "Anonymous";

    const color = getUserColor(userId);
    const userType = "editor";

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name,
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl || "",
        color,
        userType,
      },
    });
    if (room && typeof room === "string") {
      session.allow(room, session.FULL_ACCESS);
    } else {
      console.log("🔐 [Liveblocks Auth] No room provided");
    }

    const { status, body: responseBody } = await session.authorize();
    return new Response(responseBody, { status });
  } catch (error) {
    console.error("🔐 [Liveblocks Auth] Authentication error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
