import { useMutation } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";
import type { Bloq, BloqType, DocumentDataWithOwner } from "@/types";
import { updateDocument, deleteDocument } from "@/lib/actions/room.actions";
import { useState, useCallback, useMemo } from "react";

export function useLessonPlanMutations() {

  const addBloq = useMutation(({ storage }, bloqType: BloqType) => {

    const bloqs = storage.get("bloqs");

    if (!bloqs || !(bloqs && typeof bloqs === "object" && "push" in bloqs)) {
      console.error(
        "[addBloq] Bloqs is not a LiveList or is not initialized.",
        {
          bloqs,
          bloqsType: typeof bloqs,
          isLiveList: bloqs && typeof bloqs === "object" && "push" in bloqs,
        }
      );
      return;
    }

    // **FIX**: Use consistent timestamp
    const now = Date.now();

    try {
      const newBloq = new LiveObject({
        id: uuidv4(),
        title: bloqType.title,
        type: bloqType.key,
        createdAt: now,
        updatedAt: now,
        order: bloqs.length,
        content: "",
      });

      bloqs.push(newBloq);

    } catch (error) {
      console.error("[addBloq] Failed to add bloq:", error, {
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }, []);

  const updateBloq = useMutation(
    ({ storage }, id: string, updates: Partial<Bloq>) => {

      const bloqs = storage.get("bloqs");
      if (!bloqs) {
        console.error("❌ [updateBloq] No bloqs found in storage");
        return;
      }

      const bloqIndex = bloqs.findIndex((b) => b.get("id") === id);

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


    const bloqs = storage.get("bloqs");
    if (!bloqs) {
      console.error("❌ [removeBloq] No bloqs found in storage");
      return;
    }

    const bloqIndex = bloqs.findIndex((b) => b.get("id") === id);

    if (bloqIndex !== -1) {
      bloqs.delete(bloqIndex);

    }
  }, []);

  const updateLessonplan = useMutation(
    ({ storage }, updates: { title?: string; description?: string }) => {


      const lessonPlan = storage.get("lessonPlan");
      if (lessonPlan) {
        lessonPlan.update({
          ...updates,
          updatedAt: Date.now(),
        });

      } else {
        console.error("❌ [updateLessonplan] No lesson plan found in storage");
      }
    },
    []
  );


  // **FIX**: Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      addBloq,
      updateBloq,
      removeBloq,
      updateLessonplan,
    }),
    [addBloq, updateBloq, removeBloq, updateLessonplan]
  );
}

export function useDocumentActions(roomId?: string) {
  const updateDocumentMetadata = async (title: string) => {


    if (roomId) {
      try {
        await updateDocument(roomId, title);

      } catch (error) {
        console.error("❌ [updateDocumentMetadata] Failed:", error, {
          roomId,
          title,
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  const deleteCurrentDocument = async (userId: string) => {


    if (roomId) {
      try {
        await deleteDocument(roomId, userId);

      } catch (error) {
        console.error("❌ [deleteCurrentDocument] Failed:", error, {
          roomId,
          userId,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    }
  };

  return { updateDocumentMetadata, deleteCurrentDocument };
}

export function useLessonPlanList() {
  const [documents, setDocuments] = useState<DocumentDataWithOwner[]>([]);

  const deleteDocumentFromList = useCallback(
    async (roomId: string, userId: string) => {


      try {
        await deleteDocument(roomId, userId);
        setDocuments((prev) => prev.filter((doc) => doc.id !== roomId));

        return true;
      } catch (error) {
        console.error("❌ [deleteDocumentFromList] Failed:", error, {
          roomId,
          userId,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    },
    []
  );

  const setDocumentsList = useCallback((docs: DocumentDataWithOwner[]) => {

    setDocuments(docs);
  }, []);

  return {
    documents,
    setDocumentsList,
    deleteDocumentFromList,
  };
}
