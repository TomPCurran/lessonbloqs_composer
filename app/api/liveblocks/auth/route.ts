// app/api/liveblocks/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { liveblocks } from "@/lib/auth/liveblocks";
import { getUserColor } from "@/lib/utils";

interface AuthRequestBody {
  room: string;
}

function mapClerkUserToLiveblocksPayload(
  user: Awaited<ReturnType<typeof currentUser>>
) {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.emailAddresses[0].emailAddress,
    avatar: user.imageUrl,
    color: getUserColor(user.id),
    userType: "editor" as const,
  };
}

export async function POST(request: NextRequest) {
  let body: AuthRequestBody;
  try {
    body = (await request.json()) as AuthRequestBody;
    if (!body.room || typeof body.room !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid “room” in request body." },
        { status: 400 }
      );
    }
    // Optional: validate format of room ID
    // if (!/^[0-9a-f-]{36}$/.test(body.room)) { … }
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON with a “room” field." },
      { status: 400 }
    );
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unable to fetch user details." },
        { status: 500 }
      );
    }

    const userInfo = mapClerkUserToLiveblocksPayload(user);
    const session = liveblocks.prepareSession(user.id, { userInfo });

    // Grant exactly the access this user needs
    session.allow(body.room, session.FULL_ACCESS);

    const { status, body: token } = await session.authorize();
    return new Response(token, { status });
  } catch (err) {
    console.error("[Liveblocks Auth]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
