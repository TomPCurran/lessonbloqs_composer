"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRoom } from "@liveblocks/react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";

interface YjsContextType {
  doc: Y.Doc | null;
  provider: LiveblocksYjsProvider | null;
  awareness: any | null; // Add awareness to context
}

const YjsContext = createContext<YjsContextType>({
  doc: null,
  provider: null,
  awareness: null,
});

export const useYjs = () => {
  const context = useContext(YjsContext);
  if (!context) {
    throw new Error("useYjs must be used within YjsProvider");
  }
  return context;
};

export function YjsProvider({ children }: { children: React.ReactNode }) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);
  const [awareness, setAwareness] = useState<any | null>(null);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    // Get awareness from the provider - this is crucial for cursors
    const yAwareness = yProvider.awareness;

    setDoc(yDoc);
    setProvider(yProvider);
    setAwareness(yAwareness);

    return () => {
      yProvider?.destroy();
      yDoc?.destroy();
    };
  }, [room]);

  return (
    <YjsContext.Provider value={{ doc, provider, awareness }}>
      {children}
    </YjsContext.Provider>
  );
}
