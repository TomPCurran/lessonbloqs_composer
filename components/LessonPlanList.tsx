// lessonbloqs_composer copy/components/lessonplans/LessonPlanList.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FileText, MoreVertical, Copy, Share2, Archive } from "lucide-react";
import { DeleteModal } from "@/components/DeleteModal";
import { DocumentData } from "@/types";
import { useAppStore } from "@/lib/stores/appStore";

interface LessonPlanListProps {
  documents: DocumentData[];
}

export default function LessonPlanList({ documents }: LessonPlanListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  // No local loading or error state

  // Example delete handler for DeleteModal
  const handleDelete = async (roomId: string) => {
    // setGlobalLoading(true, "Deleting document..."); // This line is removed
    try {
      // Simulate async delete
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Remove from UI (in real app, update state/store)
      setOpenMenuId(null);
    } catch (error) {
      // setGlobalError("Failed to delete document. Please try again."); // This line is removed
    } finally {
      // setGlobalLoading(false, ""); // This line is removed
    }
  };

  const filtered = documents.filter((doc) =>
    doc.metadata.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMenu = (id: string) =>
    setOpenMenuId(openMenuId === id ? null : id);

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-xl">
          <Input
            type="search"
            placeholder="Search lesson plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-4 py-3 text-lg rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-md focus:ring-2 focus:ring-primary transition"
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xl">
            🔍
          </span>
        </div>
      </div>

      <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filtered.map((doc) => (
            <div key={doc.id} className="relative group">
              <div
                onClick={() => router.push(`/lessonplans/${doc.id}`)}
                className="flex items-center justify-between px-6 py-4 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-lg font-medium truncate">
                      {doc.metadata.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last modified:{" "}
                      {new Date(
                        doc.lastConnectionAt || doc.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(doc.id);
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {openMenuId === doc.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md z-10 py-1">
                      <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Copy className="w-4 h-4 mr-2" /> Copy
                      </button>
                      <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </button>
                      <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Archive className="w-4 h-4 mr-2" /> Archive
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                      <DeleteModal roomId={doc.id} onDelete={handleDelete} />
                    </div>
                  )}
                </div>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
