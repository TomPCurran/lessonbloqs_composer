import { useMutation } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";
import type { Bloq, BloqType } from "@/types";
import { updateDocument, deleteDocument } from "@/lib/actions/room.actions";
import { useState, useCallback } from "react";
import { DocumentDataWithOwner } from "@/types";

export function useLessonPlanMutations(roomId?: string) {
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

  // Separate function to update document metadata
  const updateDocumentMetadata = async (title: string) => {
    if (roomId) {
      try {
        await updateDocument(roomId, title);
      } catch (error) {
        console.error("Failed to update document metadata:", error);
      }
    }
  };

  // Function to delete the current document
  const deleteCurrentDocument = async (userId: string) => {
    if (roomId) {
      try {
        await deleteDocument(roomId, userId);
      } catch (error) {
        console.error("Failed to delete document:", error);
        throw error; // Re-throw so the UI can handle it
      }
    }
  };

  return {
    updateLessonplan,
    addBloq,
    updateBloq,
    removeBloq,
    updateDocumentMetadata,
    deleteCurrentDocument,
  };
}

// Hook for managing lesson plans list
export function useLessonPlanList() {
  const [documents, setDocuments] = useState<DocumentDataWithOwner[]>([]);

  const deleteDocumentFromList = useCallback(
    async (roomId: string, userId: string) => {
      try {
        await deleteDocument(roomId, userId);    
        setDocuments((prev) => prev.filter((doc) => doc.id !== roomId));

        return true;
      } catch (error) {
        console.error("Failed to delete document from list:", error);
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
