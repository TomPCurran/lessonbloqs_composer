import { create } from "zustand";

export interface GlobalLoadingState {
  isVisible: boolean;
  message: string;
  progress?: number;
}

export interface AppState {
  // Navigation and routing
  currentRoute: string;
  previousRoute: string;
  navigationHistory: string[];

  // Application status
  isInitialized: boolean;
  isOnline: boolean;
  lastActivity: number;

  // Global loading state
  globalLoading: GlobalLoadingState;

  // Global error state
  globalError: string | null;

  // Actions
  setCurrentRoute: (route: string) => void;
  setGlobalLoading: (
    loading: boolean,
    message?: string,
    progress?: number
  ) => void;
  setInitialized: (initialized: boolean) => void;
  setOnline: (online: boolean) => void;
  setLastActivity: (timestamp: number) => void;
  setGlobalError: (error: string | null) => void;
  resetAppState: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  currentRoute: "",
  previousRoute: "",
  navigationHistory: [],
  isInitialized: false,
  isOnline: true,
  lastActivity: Date.now(),
  globalLoading: {
    isVisible: false,
    message: "",
    progress: undefined,
  },
  globalError: null,
  setCurrentRoute: (route) => {
    const { currentRoute, navigationHistory } = get();
    set({
      previousRoute: currentRoute,
      currentRoute: route,
      navigationHistory: [...navigationHistory, route],
    });
  },
  setGlobalLoading: (loading, message = "", progress) =>
    set({
      globalLoading: {
        isVisible: loading,
        message,
        progress,
      },
    }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  setOnline: (online) => set({ isOnline: online }),
  setLastActivity: (timestamp) => set({ lastActivity: timestamp }),
  setGlobalError: (error) => set({ globalError: error }),
  resetAppState: () =>
    set({
      currentRoute: "",
      previousRoute: "",
      navigationHistory: [],
      isInitialized: false,
      isOnline: true,
      lastActivity: Date.now(),
      globalLoading: {
        isVisible: false,
        message: "",
        progress: undefined,
      },
      globalError: null,
    }),
}));
