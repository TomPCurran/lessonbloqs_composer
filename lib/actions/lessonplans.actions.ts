import { LiveObject } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";
import type { Bloq, BloqType } from "@/types";

export function createBloq(
  bloqType: BloqType,
  order: number
): LiveObject<Bloq> {
  return new LiveObject({
    id: uuidv4(),
    title: bloqType.title,
    type: bloqType.key,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    order,
    content: "",
  });
}
