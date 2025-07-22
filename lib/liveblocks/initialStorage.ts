// lib/liveblocks/initializeStorage.ts
import { LiveObject, LiveList } from "@liveblocks/client";

export const createInitialStorage = ({
  title,
  creatorId,
  timestamp,
}: {
  title: string;
  creatorId: string;
  timestamp: number;
}) => ({
  lessonPlan: new LiveObject({
    title: title ?? "",
    description: "",
    createdAt: timestamp,
    updatedAt: timestamp,
    creatorId,
  }),
  bloqs: new LiveList([]),
  settings: new LiveObject({
    allowComments: true,
    allowEditing: true,
    lastSaved: timestamp,
  }),
});
