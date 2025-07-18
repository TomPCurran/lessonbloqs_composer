"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRoom, useStatus } from "@liveblocks/react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Awareness } from "y-protocols/awareness";

// Define the shape of the context value
interface YjsContextValue {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  awareness: Awareness;
}

const YjsContext = createContext<YjsContextValue | null>(null);

export const useYjs = (): YjsContextValue | null => {
  const context = useContext(YjsContext);
  return context;
};

export function YjsProvider({ children }: { children: ReactNode }) {
  const room = useRoom();
  const status = useStatus();
  const [yjsState, setYjsState] = useState<YjsContextValue | null>(null);

  // **FIXED**: Only require room to be connected, don't depend on storage items
  // Storage items can become temporarily undefined during mutations
  const isRoomReady = status === "connected";

  console.log("🔧 [YjsProvider] Status:", status, "isRoomReady:", isRoomReady);

  useEffect(() => {
    // **FIXED**: Only initialize Yjs when room is connected
    if (!isRoomReady) {
      console.log(
        "🔧 [YjsProvider] Room not connected, skipping initialization"
      );
      return;
    }

    console.log("🔧 [YjsProvider] Initializing Yjs provider");

    // Create the Yjs document and provider only once
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    const yAwareness = yProvider.awareness;

    setYjsState({
      doc: yDoc,
      provider: yProvider,
      awareness: yAwareness,
    });

    // Cleanup function to destroy the provider and doc when the component unmounts
    return () => {
      yProvider.destroy();
      yDoc.destroy();
    };
  }, [room, isRoomReady]);

  // **FIXED**: Only show loading state if room is not connected, not if Yjs is not initialized
  // This prevents showing loading state during storage mutations
  if (!isRoomReady) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-muted-foreground">Connecting to room...</div>
      </div>
    );
  }

  // If room is connected but Yjs is not ready, render children anyway
  // The Editor components will handle their own loading states
  if (!yjsState) {
    console.log(
      "🔧 [YjsProvider] Room connected but Yjs not ready, rendering children"
    );
    return <>{children}</>;
  }

  return <YjsContext.Provider value={yjsState}>{children}</YjsContext.Provider>;
}
