"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStorage } from "@liveblocks/react";
import {
  useLessonPlanMutations,
  useDocumentActions,
} from "@/lib/hooks/useLessonplanHooks";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Eye, CloudUpload } from "lucide-react";
import { useFormStore } from "@/lib/stores/formStore";

interface EditableTitleProps {
  roomId: string;
  initialTitle?: string;
  currentUserType: "creator" | "editor" | "viewer";
}

const EditableTitle = ({
  roomId,
  initialTitle,
  currentUserType,
}: EditableTitleProps) => {
  const lessonPlan = useStorage((root) => root.lessonPlan);
  const { updateLessonplan } = useLessonPlanMutations();
  const { updateDocumentMetadata } = useDocumentActions(roomId);

  // Zustand form store for document editing
  const {
    documentEditing,
    updateDocumentTitle,
    setDocumentEditing,
    resetDocumentEditing,
  } = useFormStore();

  const canEdit = currentUserType === "creator" || currentUserType === "editor";
  const lastSavedTitle = useRef<string>("");
  const [isSaving, setIsSaving] = React.useState(false);

  // On mount or when lessonPlan changes, sync Zustand title
  useEffect(() => {
    if (lessonPlan?.title) {
      updateDocumentTitle(lessonPlan.title);
      lastSavedTitle.current = lessonPlan.title;
    } else if (initialTitle) {
      updateDocumentTitle(initialTitle);
      lastSavedTitle.current = initialTitle;
    }
    // Reset editing state on unmount
    return () => {
      resetDocumentEditing();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonPlan?.title, initialTitle]);

  // Debounce for Liveblocks updates (fast - 200ms for real-time feel)
  const debouncedLiveTitle = useDebounce(documentEditing.title, 200);

  // Debounce for backend saves (slower - 1000ms to reduce server calls)
  const debouncedBackendTitle = useDebounce(documentEditing.title, 1000);

  // Effect to update Liveblocks storage immediately (for real-time collaboration)
  useEffect(() => {
    if (
      lessonPlan &&
      canEdit &&
      debouncedLiveTitle &&
      debouncedLiveTitle !== lessonPlan.title
    ) {
      updateLessonplan({ title: debouncedLiveTitle });
    }
  }, [debouncedLiveTitle, canEdit, updateLessonplan, lessonPlan]);

  // Effect to save to backend (less frequently, and only when really needed)
  useEffect(() => {
    if (
      canEdit &&
      debouncedBackendTitle &&
      debouncedBackendTitle !== lastSavedTitle.current &&
      debouncedBackendTitle.trim() !== ""
    ) {
      setIsSaving(true);

      updateDocumentMetadata(debouncedBackendTitle)
        .then(() => {
          lastSavedTitle.current = debouncedBackendTitle;
        })
        .catch((error) => {
          console.error("[EditableTitle] Backend save failed:", error);
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  }, [debouncedBackendTitle, canEdit, updateDocumentMetadata]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canEdit) return;
      updateDocumentTitle(e.target.value);
      setDocumentEditing(true);
    },
    [canEdit, updateDocumentTitle, setDocumentEditing]
  );

  return (
    <div className="w-full flex flex-col items-center space-grid-2">
      <div className="relative group w-full max-w-4xl">
        <Input
          type="text"
          value={documentEditing.title ?? ""}
          onChange={handleTitleChange}
          placeholder={
            canEdit ? "Enter Lesson Plan Title" : "Untitled Document"
          }
          disabled={!canEdit}
          className={cn(
            "w-full text-center bg-transparent border-none p-grid-2 h-auto",
            "text-display-large font-normal text-foreground",
            "placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:ring-0",
            "transition-all duration-200",
            canEdit &&
              "hover:bg-surface-variant/30 focus:bg-surface-variant/50",
            canEdit && "rounded-lg",
            !canEdit && "cursor-default opacity-80"
          )}
        />

        {canEdit && (
          <div
            className={cn(
              "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-primary transition-all duration-200",
              "scale-x-0 group-focus-within:scale-x-100"
            )}
          />
        )}

        {/* Saving indicator */}
        {canEdit && isSaving && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <CloudUpload className="w-3 h-3 animate-pulse" />
            <span className="text-xs font-medium">Saving...</span>
          </div>
        )}

        {!canEdit && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-muted/80 text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span className="text-xs font-medium">View Only</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableTitle;

// "use client";

// import React, { useCallback, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { useStorage } from "@liveblocks/react";
// import {
//   useLessonPlanMutations,
//   useDocumentActions,
// } from "@/lib/hooks/useLessonplanHooks";
// import { useDebounce } from "@/lib/hooks/useDebounce";
// import { Eye } from "lucide-react";
// import { useFormStore } from "@/lib/stores/formStore";

// interface EditableTitleProps {
//   roomId: string;
//   initialTitle?: string;
//   currentUserType: "creator" | "editor" | "viewer";
// }

// const EditableTitle = ({
//   roomId,
//   initialTitle,
//   currentUserType,
// }: EditableTitleProps) => {
//   const lessonPlan = useStorage((root) => root.lessonPlan);
//   const { updateLessonplan } = useLessonPlanMutations();
//   const { updateDocumentMetadata } = useDocumentActions(roomId);

//   // Zustand form store for document editing
//   const {
//     documentEditing,
//     updateDocumentTitle,
//     setDocumentEditing,
//     resetDocumentEditing,
//   } = useFormStore();

//   const canEdit = currentUserType === "creator" || currentUserType === "editor";

//   // On mount or when lessonPlan changes, sync Zustand title
//   useEffect(() => {
//     if (lessonPlan?.title) {
//       updateDocumentTitle(lessonPlan.title);
//     } else if (initialTitle) {
//       updateDocumentTitle(initialTitle);
//     }
//     // Reset editing state on unmount
//     return () => {
//       resetDocumentEditing();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [lessonPlan, initialTitle]);

//   // Debounce the Zustand title value
//   const debouncedTitle = useDebounce(documentEditing.title, 500);

//   // Effect to update Liveblocks storage and database when debounced title changes
//   useEffect(() => {
//     if (
//       lessonPlan &&
//       canEdit &&
//       debouncedTitle &&
//       debouncedTitle !== lessonPlan.title
//     ) {
//       updateLessonplan({ title: debouncedTitle });
//       updateDocumentMetadata(debouncedTitle);
//     }
//   }, [
//     debouncedTitle,
//     canEdit,
//     updateLessonplan,
//     updateDocumentMetadata,
//     lessonPlan,
//   ]);

//   const handleTitleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       if (!canEdit) return;
//       updateDocumentTitle(e.target.value);
//       setDocumentEditing(true);
//     },
//     [canEdit, updateDocumentTitle, setDocumentEditing]
//   );

//   return (
//     <div className="w-full flex flex-col items-center space-grid-2">
//       <div className="relative group w-full max-w-4xl">
//         <Input
//           type="text"
//           value={documentEditing.title ?? ""}
//           onChange={handleTitleChange}
//           placeholder={
//             canEdit ? "Enter Lesson Plan Title" : "Untitled Document"
//           }
//           disabled={!canEdit}
//           className={cn(
//             "w-full text-center bg-transparent border-none p-grid-2 h-auto",
//             "text-display-large font-normal text-foreground",
//             "placeholder:text-muted-foreground/60",
//             "focus-visible:outline-none focus-visible:ring-0",
//             "transition-all duration-200",
//             canEdit &&
//               "hover:bg-surface-variant/30 focus:bg-surface-variant/50",
//             canEdit && "rounded-lg",
//             !canEdit && "cursor-default opacity-80"
//           )}
//         />

//         {canEdit && (
//           <div
//             className={cn(
//               "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-primary transition-all duration-200",
//               "scale-x-0 group-focus-within:scale-x-100"
//             )}
//           />
//         )}

//         {!canEdit && (
//           <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-muted/80 text-muted-foreground">
//             <Eye className="w-3 h-3" />
//             <span className="text-xs font-medium">View Only</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditableTitle;
