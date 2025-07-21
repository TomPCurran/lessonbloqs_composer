import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DocumentDataWithOwner } from "@/types";

// Document State interface
export interface DocumentState {
  // Document list management (non-collaborative)
  documents: DocumentDataWithOwner[];
  filteredDocuments: DocumentDataWithOwner[];
  searchQuery: string;
  selectedDocumentId: string | null;

  // Document operations state
  isCreatingDocument: boolean;
  isDeletingDocument: boolean;
  lastOperation: "create" | "delete" | "update" | null;
  lastOperationTimestamp: number | null;

  // Document list filters and sorting
  currentFilter: "all" | "my" | "shared";
  sortBy: "title" | "lastModified" | "created";
  sortOrder: "asc" | "desc";

  // Actions
  setDocuments: (docs: DocumentDataWithOwner[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedDocument: (id: string | null) => void;
  setFilter: (filter: "all" | "my" | "shared") => void;
  setSortBy: (sortBy: "title" | "lastModified" | "created") => void;
  setSortOrder: (order: "asc" | "desc") => void;

  // Document operations
  setCreatingDocument: (creating: boolean) => void;
  setDeletingDocument: (deleting: boolean) => void;
  addDocument: (document: DocumentDataWithOwner) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<DocumentDataWithOwner>) => void;

  // Utility actions
  clearSearch: () => void;
  resetDocumentState: () => void;
  getDocumentById: (id: string) => DocumentDataWithOwner | undefined;
}

// Create the document store with selective persistence
export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      // Initial state
      documents: [],
      filteredDocuments: [],
      searchQuery: "",
      selectedDocumentId: null,
      isCreatingDocument: false,
      isDeletingDocument: false,
      lastOperation: null,
      lastOperationTimestamp: null,
      currentFilter: "all",
      sortBy: "lastModified",
      sortOrder: "desc",

      // Actions
      setDocuments: (docs) => {
        const { searchQuery, currentFilter, sortBy, sortOrder } = get();
        const filtered = filterAndSortDocuments(
          docs,
          searchQuery,
          currentFilter,
          sortBy,
          sortOrder
        );

        set({
          documents: docs,
          filteredDocuments: filtered,
        });
      },

      setSearchQuery: (query) => {
        const { documents, currentFilter, sortBy, sortOrder } = get();
        const filtered = filterAndSortDocuments(
          documents,
          query,
          currentFilter,
          sortBy,
          sortOrder
        );

        set({
          searchQuery: query,
          filteredDocuments: filtered,
        });
      },

      setSelectedDocument: (id) => set({ selectedDocumentId: id }),

      setFilter: (filter) => {
        const { documents, searchQuery, sortBy, sortOrder } = get();
        const filtered = filterAndSortDocuments(
          documents,
          searchQuery,
          filter,
          sortBy,
          sortOrder
        );

        set({
          currentFilter: filter,
          filteredDocuments: filtered,
        });
      },

      setSortBy: (sortBy) => {
        const { documents, searchQuery, currentFilter, sortOrder } = get();
        const filtered = filterAndSortDocuments(
          documents,
          searchQuery,
          currentFilter,
          sortBy,
          sortOrder
        );

        set({
          sortBy,
          filteredDocuments: filtered,
        });
      },

      setSortOrder: (order) => {
        const { documents, searchQuery, currentFilter, sortBy } = get();
        const filtered = filterAndSortDocuments(
          documents,
          searchQuery,
          currentFilter,
          sortBy,
          order
        );

        set({
          sortOrder: order,
          filteredDocuments: filtered,
        });
      },

      setCreatingDocument: (creating) => set({ isCreatingDocument: creating }),

      setDeletingDocument: (deleting) => set({ isDeletingDocument: deleting }),

      addDocument: (document) => {
        const { documents, searchQuery, currentFilter, sortBy, sortOrder } =
          get();
        const updatedDocuments = [...documents, document];
        const filtered = filterAndSortDocuments(
          updatedDocuments,
          searchQuery,
          currentFilter,
          sortBy,
          sortOrder
        );

        set({
          documents: updatedDocuments,
          filteredDocuments: filtered,
          lastOperation: "create",
          lastOperationTimestamp: Date.now(),
        });
      },

      removeDocument: (id) => {
        const { documents, searchQuery, currentFilter, sortBy, sortOrder } =
          get();
        const updatedDocuments = documents.filter((doc) => doc.id !== id);
        const filtered = filterAndSortDocuments(
          updatedDocuments,
          searchQuery,
          currentFilter,
          sortBy,
          sortOrder
        );

        set({
          documents: updatedDocuments,
          filteredDocuments: filtered,
          selectedDocumentId:
            get().selectedDocumentId === id ? null : get().selectedDocumentId,
          lastOperation: "delete",
          lastOperationTimestamp: Date.now(),
        });
      },

      updateDocument: (id, updates) => {
        const { documents, searchQuery, currentFilter, sortBy, sortOrder } =
          get();
        const updatedDocuments = documents.map((doc) =>
          doc.id === id ? { ...doc, ...updates } : doc
        );
        const filtered = filterAndSortDocuments(
          updatedDocuments,
          searchQuery,
          currentFilter,
          sortBy,
          sortOrder
        );

        set({
          documents: updatedDocuments,
          filteredDocuments: filtered,
          lastOperation: "update",
          lastOperationTimestamp: Date.now(),
        });
      },

      clearSearch: () => {
        const { documents, currentFilter, sortBy, sortOrder } = get();
        const filtered = filterAndSortDocuments(
          documents,
          "",
          currentFilter,
          sortBy,
          sortOrder
        );

        set({
          searchQuery: "",
          filteredDocuments: filtered,
        });
      },

      resetDocumentState: () =>
        set({
          documents: [],
          filteredDocuments: [],
          searchQuery: "",
          selectedDocumentId: null,
          isCreatingDocument: false,
          isDeletingDocument: false,
          lastOperation: null,
          lastOperationTimestamp: null,
          currentFilter: "all",
          sortBy: "lastModified",
          sortOrder: "desc",
        }),

      getDocumentById: (id) => {
        const { documents } = get();
        return documents.find((doc) => doc.id === id);
      },
    }),
    {
      name: "document-storage",
      partialize: (state) => ({
        // Only persist user preferences, not document data
        currentFilter: state.currentFilter,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        searchQuery: state.searchQuery, // Persist search for better UX
      }),
    }
  )
);

// Helper function to filter and sort documents
function filterAndSortDocuments(
  documents: DocumentDataWithOwner[],
  searchQuery: string,
  filter: "all" | "my" | "shared",
  sortBy: "title" | "lastModified" | "created",
  sortOrder: "asc" | "desc"
): DocumentDataWithOwner[] {
  let filtered = documents;

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (doc) =>
        doc.metadata.title.toLowerCase().includes(query) ||
        doc.ownerName?.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (filter === "my") {
    filtered = filtered.filter((doc) => doc.currentUserType === "creator");
  } else if (filter === "shared") {
    filtered = filtered.filter((doc) => doc.currentUserType !== "creator");
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case "title":
        aValue = a.metadata.title.toLowerCase();
        bValue = b.metadata.title.toLowerCase();
        break;
      case "lastModified":
        aValue = a.lastConnectionAt || a.createdAt || 0;
        bValue = b.lastConnectionAt || b.createdAt || 0;
        break;
      case "created":
        aValue = a.createdAt || 0;
        bValue = b.createdAt || 0;
        break;
      default:
        aValue = a.metadata.title.toLowerCase();
        bValue = b.metadata.title.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
}
