"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRoom } from "@liveblocks/react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";

// Define the shape of the context value
interface YjsContextValue {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  awareness: LiveblocksYjsProvider["awareness"];
}

const YjsContext = createContext<YjsContextValue | null>(null);

export const useYjs = (): YjsContextValue => {
  const context = useContext(YjsContext);
  if (!context) {
    throw new Error("useYjs must be used within a YjsProvider");
  }
  return context;
};

export function YjsProvider({ children }: { children: ReactNode }) {
  const room = useRoom();
  const [yjsState, setYjsState] = useState<YjsContextValue | null>(null);

  useEffect(() => {
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
    // The `room` object is stable, so this effect runs only once
  }, [room]);

  // Render a loading state until the Yjs state is initialized
  if (!yjsState) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-muted-foreground">
          Initializing collaboration...
        </div>
      </div>
    );
  }

  return <YjsContext.Provider value={yjsState}>{children}</YjsContext.Provider>;
}
