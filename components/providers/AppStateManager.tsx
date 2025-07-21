"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/stores/appStore";

export default function AppStateManager() {
  const pathname = usePathname();
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);
  const globalLoading = useAppStore((state) => state.globalLoading);
  const globalError = useAppStore((state) => state.globalError);

  // Track route changes
  useEffect(() => {
    if (pathname) {
      setCurrentRoute(pathname);
    }
  }, [pathname, setCurrentRoute]);

  return (
    <>
      {/* Global Loading Overlay */}
      {globalLoading.isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 flex flex-col items-center gap-4 min-w-[240px]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="text-lg font-medium text-primary">
              {globalLoading.message || "Loading..."}
            </div>
            {typeof globalLoading.progress === "number" && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${globalLoading.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {/* Global Error Overlay */}
      {globalError && (
        <div className="fixed top-4 left-1/2 z-[9999] -translate-x-1/2 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg shadow-lg border border-destructive animate-fade-in">
          <span className="font-semibold">Error:</span> {globalError}
        </div>
      )}
    </>
  );
}
