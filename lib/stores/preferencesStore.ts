import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EditorSettings {
  autoSave: boolean;
  spellCheck: boolean;
  fontSize: number;
  wordCount: boolean;
}

export interface CollaborationSettings {
  showCursors: boolean;
  showPresence: boolean;
}

export interface UserPreferencesState {
  // Theme and appearance
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
  compactMode: boolean;

  // Editor preferences
  editorSettings: EditorSettings;

  // Collaboration preferences
  collaborationSettings: CollaborationSettings;

  // Actions
  setTheme: (theme: "light" | "dark" | "system") => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCompactMode: (compact: boolean) => void;
  updateEditorSettings: (settings: Partial<EditorSettings>) => void;
  updateCollaborationSettings: (
    settings: Partial<CollaborationSettings>
  ) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarCollapsed: false,
      compactMode: false,
      editorSettings: {
        autoSave: true,
        spellCheck: true,
        fontSize: 16,
        wordCount: false,
      },
      collaborationSettings: {
        showCursors: true,
        showPresence: true,
      },
      setTheme: (theme) => set({ theme }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setCompactMode: (compact) => set({ compactMode: compact }),
      updateEditorSettings: (settings) =>
        set((state) => ({
          editorSettings: { ...state.editorSettings, ...settings },
        })),
      updateCollaborationSettings: (settings) =>
        set((state) => ({
          collaborationSettings: {
            ...state.collaborationSettings,
            ...settings,
          },
        })),
      resetPreferences: () =>
        set({
          theme: "system",
          sidebarCollapsed: false,
          compactMode: false,
          editorSettings: {
            autoSave: true,
            spellCheck: true,
            fontSize: 16,
            wordCount: false,
          },
          collaborationSettings: {
            showCursors: true,
            showPresence: true,
          },
        }),
    }),
    {
      name: "user-preferences",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        compactMode: state.compactMode,
        editorSettings: state.editorSettings,
        collaborationSettings: state.collaborationSettings,
      }),
    }
  )
);
