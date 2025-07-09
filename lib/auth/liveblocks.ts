import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

// Note: For client-side Lexical integration, use @liveblocks/react-lexical directly
// The liveblocksConfig function was incorrectly trying to use server-side Liveblocks
