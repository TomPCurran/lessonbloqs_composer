import { useMutation } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";
import type { Bloq, BloqType, DocumentDataWithOwner } from "@/types";
import { updateDocument, deleteDocument } from "@/lib/actions/room.actions";
import { useState, useCallback, useMemo } from "react";

export function useLessonPlanMutations() {
  console.log("🎯 [useLessonPlanMutations] Hook initialized");

  const addBloq = useMutation(({ storage }, bloqType: BloqType) => {
    console.log("🎯 [addBloq] Starting mutation", {
      bloqType: bloqType.title,
      key: bloqType.key,
      timestamp: new Date().toISOString(),
    });

    const bloqs = storage.get("bloqs");

    console.log("🎯 [addBloq] Got bloqs from storage", {
      bloqsType: typeof bloqs,
      isLiveList: bloqs && typeof bloqs === "object" && "push" in bloqs,
      currentLength: bloqs?.length || 0,
      timestamp: new Date().toISOString(),
    });

    if (!bloqs || !(bloqs && typeof bloqs === "object" && "push" in bloqs)) {
      console.error(
        "❌ [addBloq] Bloqs is not a LiveList or is not initialized.",
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

      console.log("🎯 [addBloq] Created new bloq object", {
        bloqId: newBloq.get("id"),
        bloqTitle: newBloq.get("title"),
        bloqType: newBloq.get("type"),
        order: newBloq.get("order"),
        timestamp: new Date().toISOString(),
      });

      bloqs.push(newBloq);

      console.log("✅ [addBloq] Bloq added successfully", {
        newLength: bloqs.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ [addBloq] Failed to add bloq:", error, {
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }, []);

  console.log("🎯 [useLessonPlanMutations] Returning mutations");

  const updateBloq = useMutation(
    ({ storage }, id: string, updates: Partial<Bloq>) => {
      console.log("🔄 [updateBloq] Starting mutation", {
        bloqId: id,
        updates,
        timestamp: new Date().toISOString(),
      });

      const bloqs = storage.get("bloqs");
      if (!bloqs) {
        console.error("❌ [updateBloq] No bloqs found in storage");
        return;
      }

      const bloqIndex = bloqs.findIndex((b) => b.get("id") === id);
      console.log("🔄 [updateBloq] Found bloq at index", {
        bloqIndex,
        totalBloqs: bloqs.length,
        timestamp: new Date().toISOString(),
      });

      if (bloqIndex !== -1) {
        const bloq = bloqs.get(bloqIndex);
        if (bloq) {
          bloq.update({
            ...updates,
            updatedAt: Date.now(),
          });
          console.log("✅ [updateBloq] Bloq updated successfully", {
            bloqId: id,
            timestamp: new Date().toISOString(),
          });
        }
      }
    },
    []
  );

  const removeBloq = useMutation(({ storage }, id: string) => {
    console.log("🗑️ [removeBloq] Starting mutation", {
      bloqId: id,
      timestamp: new Date().toISOString(),
    });

    const bloqs = storage.get("bloqs");
    if (!bloqs) {
      console.error("❌ [removeBloq] No bloqs found in storage");
      return;
    }

    const bloqIndex = bloqs.findIndex((b) => b.get("id") === id);
    console.log("🗑️ [removeBloq] Found bloq at index", {
      bloqIndex,
      totalBloqs: bloqs.length,
      timestamp: new Date().toISOString(),
    });

    if (bloqIndex !== -1) {
      bloqs.delete(bloqIndex);
      console.log("✅ [removeBloq] Bloq removed successfully", {
        bloqId: id,
        newLength: bloqs.length,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  const updateLessonplan = useMutation(
    ({ storage }, updates: { title?: string; description?: string }) => {
      console.log("📝 [updateLessonplan] Starting mutation", {
        updates,
        timestamp: new Date().toISOString(),
      });

      const lessonPlan = storage.get("lessonPlan");
      if (lessonPlan) {
        lessonPlan.update({
          ...updates,
          updatedAt: Date.now(),
        });
        console.log("✅ [updateLessonplan] Lesson plan updated successfully", {
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error("❌ [updateLessonplan] No lesson plan found in storage");
      }
    },
    []
  );

  console.log("🎯 [useLessonPlanMutations] Returning mutations");

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
    console.log("📄 [updateDocumentMetadata] Starting", {
      roomId,
      title,
      timestamp: new Date().toISOString(),
    });

    if (roomId) {
      try {
        await updateDocument(roomId, title);
        console.log("✅ [updateDocumentMetadata] Success", {
          roomId,
          title,
          timestamp: new Date().toISOString(),
        });
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
    console.log("🗑️ [deleteCurrentDocument] Starting", {
      roomId,
      userId,
      timestamp: new Date().toISOString(),
    });

    if (roomId) {
      try {
        await deleteDocument(roomId, userId);
        console.log("✅ [deleteCurrentDocument] Success", {
          roomId,
          userId,
          timestamp: new Date().toISOString(),
        });
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
      console.log("🗑️ [deleteDocumentFromList] Starting", {
        roomId,
        userId,
        timestamp: new Date().toISOString(),
      });

      try {
        await deleteDocument(roomId, userId);
        setDocuments((prev) => prev.filter((doc) => doc.id !== roomId));
        console.log("✅ [deleteDocumentFromList] Success", {
          roomId,
          userId,
          timestamp: new Date().toISOString(),
        });
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
    console.log("📋 [setDocumentsList] Setting documents", {
      count: docs.length,
      timestamp: new Date().toISOString(),
    });
    setDocuments(docs);
  }, []);

  return {
    documents,
    setDocumentsList,
    deleteDocumentFromList,
  };
}
