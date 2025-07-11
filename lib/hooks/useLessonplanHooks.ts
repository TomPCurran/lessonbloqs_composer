import { useMutation } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";
import type { Bloq, BloqType } from "@/types";

export function useLessonPlanMutations() {
  const updateLessonplan = useMutation(
    ({ storage }, updates: { title?: string; description?: string }) => {
      // Check if storage is loaded
      if (!storage) return;

      const lessonPlan = storage.get("lessonPlan");
      if (lessonPlan) {
        lessonPlan.update({
          ...updates,
          updatedAt: Date.now(),
        });
      }
    },
    []
  );

  const addBloq = useMutation(({ storage }, bloqType: BloqType) => {
    // Check if storage is loaded
    if (!storage) return;

    const bloqs = storage.get("bloqs");
    if (!bloqs) return;

    const newBloq = new LiveObject({
      id: uuidv4(),
      title: bloqType.title,
      type: bloqType.key,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: bloqs.length,
      content: "",
    });
    console.log("[addBloq] Adding new bloq:", newBloq.toObject());
    bloqs.push(newBloq);
  }, []);

  const updateBloq = useMutation(
    ({ storage }, id: string, updates: Partial<Bloq>) => {
      // Check if storage is loaded
      if (!storage) return;

      const bloqs = storage.get("bloqs");
      if (!bloqs) return;

      const bloqIndex = bloqs.findIndex((bloq) => bloq.get("id") === id);
      if (bloqIndex !== -1) {
        const bloq = bloqs.get(bloqIndex);
        if (bloq) {
          bloq.update({
            ...updates,
            updatedAt: Date.now(),
          });
        }
      }
    },
    []
  );

  const removeBloq = useMutation(({ storage }, id: string) => {
    // Check if storage is loaded
    if (!storage) return;

    const bloqs = storage.get("bloqs");
    if (!bloqs) return;

    const bloqIndex = bloqs.findIndex((bloq) => bloq.get("id") === id);
    if (bloqIndex !== -1) {
      bloqs.delete(bloqIndex);
    }
  }, []);

  return { updateLessonplan, addBloq, updateBloq, removeBloq };
}
