// lessonbloqs_composer copy/components/lessonplans/UploadButton.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default function UploadButton() {
  const handleUpload = () => {
    // In the future, you can add your file upload logic here.
    // For example, opening a file dialog or calling an API.
    alert("Upload functionality coming soon!");
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
