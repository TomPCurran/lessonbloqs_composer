"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/uiStore";

export const ZustandTest: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen, addNotification } = useUIStore();

  const handleTestNotification = () => {
    addNotification({
      type: "success",
      title: "Zustand is working!",
      message: "Your state management is properly configured.",
      duration: 3000,
    });
  };

  const handleTestErrorNotification = () => {
    addNotification({
      type: "error",
      title: "Test Error",
      message: "This is a test error notification.",
      duration: 5000,
    });
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-background">
      <h3 className="text-lg font-semibold">Zustand Test Component</h3>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Sidebar is currently:{" "}
          <span className="font-medium">
            {isSidebarOpen ? "Open" : "Closed"}
          </span>
        </p>

        <div className="flex gap-2">
          <Button onClick={handleToggleSidebar} variant="outline" size="sm">
            Toggle Sidebar
          </Button>

          <Button onClick={handleTestNotification} variant="default" size="sm">
            Test Success Notification
          </Button>

          <Button
            onClick={handleTestErrorNotification}
            variant="destructive"
            size="sm"
          >
            Test Error Notification
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        This component demonstrates Zustand state management. Check the
        top-right corner for notifications!
      </p>
    </div>
  );
};
