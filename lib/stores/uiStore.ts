import { create } from "zustand";
import { persist } from "zustand/middleware";

// UI State interface
export interface UIState {
  // Modal states
  isShareModalOpen: boolean;
  isSignInModalOpen: boolean;
  isSignUpModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isMobileMenuOpen: boolean;
  isSidebarOpen: boolean;
  isLoading: boolean;
  loadingMessage: string;

  // Actions
  setShareModalOpen: (open: boolean) => void;
  setSignInModalOpen: (open: boolean) => void;
  setSignUpModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean, message?: string) => void;
}

// Create the store with persistence for sidebar state
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      isShareModalOpen: false,
      isSignInModalOpen: false,
      isSignUpModalOpen: false,
      isDeleteModalOpen: false,
      isMobileMenuOpen: false,
      isSidebarOpen: true,
      isLoading: false,
      loadingMessage: "",

      // Actions
      setShareModalOpen: (open) => set({ isShareModalOpen: open }),
      setSignInModalOpen: (open) => set({ isSignInModalOpen: open }),
      setSignUpModalOpen: (open) => set({ isSignUpModalOpen: open }),
      setDeleteModalOpen: (open) => set({ isDeleteModalOpen: open }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),

      setLoading: (loading, message = "") =>
        set({ isLoading: loading, loadingMessage: message }),
    }),
    {
      name: "ui-storage", // Local storage key
      partialize: (state) => ({
        // Only persist sidebar state
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
