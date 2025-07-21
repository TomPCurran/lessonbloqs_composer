// lessonbloqs_composer copy/components/lessonplans/UploadButton.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";

export default function UploadButton() {
  // No local loading or error state
  const handleUpload = async () => {
    try {
      // In the future, you can add your file upload logic here.
      // For example, opening a file dialog or calling an API.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Upload functionality coming soon!");
    } catch (error) {
      // setGlobalError("Failed to upload lesson plan. Please try again."); // This line was removed
    } finally {
      // setGlobalLoading(false, ""); // This line was removed
    }
  };

  return (
    <Button
      onClick={handleUpload}
      variant="outline"
      className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner hover:shadow-sm transition-shadow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      <UploadCloud className="w-5 h-5 text-primary" />
      <span>Upload Lesson Plan</span>
    </Button>
  );
}
