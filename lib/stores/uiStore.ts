import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for notifications
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  createdAt: number;
}

// UI State interface
interface UIState {
  // Modal states
  isShareModalOpen: boolean;
  isSignInModalOpen: boolean;
  isSignUpModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isMobileMenuOpen: boolean;

  // Sidebar state
  isSidebarOpen: boolean;

  // Notifications
  notifications: Notification[];

  // Loading states
  isLoading: boolean;
  loadingMessage: string;

  // Actions
  setShareModalOpen: (open: boolean) => void;
  setSignInModalOpen: (open: boolean) => void;
  setSignUpModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean, message?: string) => void;
}

// Create the store with persistence for sidebar state
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      isShareModalOpen: false,
      isSignInModalOpen: false,
      isSignUpModalOpen: false,
      isDeleteModalOpen: false,
      isMobileMenuOpen: false,
      isSidebarOpen: true,
      notifications: [],
      isLoading: false,
      loadingMessage: "",

      // Actions
      setShareModalOpen: (open) => set({ isShareModalOpen: open }),
      setSignInModalOpen: (open) => set({ isSignInModalOpen: open }),
      setSignUpModalOpen: (open) => set({ isSignUpModalOpen: open }),
      setDeleteModalOpen: (open) => set({ isDeleteModalOpen: open }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now(),
          duration: notification.duration || 5000, // Default 5 seconds
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, newNotification.duration);
        }
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),

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
