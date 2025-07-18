"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, MoreVertical, Copy, Share2, Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { DocumentDataWithOwner } from "@/types";
import { useLessonPlanList } from "@/lib/hooks/useLessonplanHooks";
import { DeleteModal } from "./DeleteModal";

interface DocumentTabsProps {
  myDocuments: DocumentDataWithOwner[];
  sharedDocuments: DocumentDataWithOwner[];
}

// Portal dropdown component
function MenuDropdown({
  anchorEl,
  open,
  children,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  children: React.ReactNode;
}) {
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8, // 8px margin
        left: rect.right - 192 + window.scrollX, // 192px = w-48
        width: rect.width,
      });
    }
  }, [open, anchorEl]);
  if (!open || typeof window === "undefined") return null;
  return createPortal(
    <div
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        zIndex: 9999,
        minWidth: 192,
      }}
      className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md py-1"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}

export default function DocumentTabs({
  myDocuments,
  sharedDocuments,
}: DocumentTabsProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuButtonRefs = useRef<{ [id: string]: HTMLElement | null }>({});
  const { setDocumentsList, deleteDocumentFromList, documents } =
    useLessonPlanList();

  // Initialize documents when props change
  useEffect(() => {
    const allDocuments = [...myDocuments, ...sharedDocuments];
    setDocumentsList(allDocuments);
  }, [myDocuments, sharedDocuments, setDocumentsList]);

  // Get current user ID from the first document (all docs have currentUser)
  const userId = documents[0]?.currentUser?.id || "";

  // Use the props directly instead of re-filtering
  const myDocs = myDocuments;
  const sharedDocs = sharedDocuments;

  const toggleMenu = useCallback(
    (id: string) => {
      setOpenMenuId(openMenuId === id ? null : id);
    },
    [openMenuId]
  );

  const handleDelete = async (roomId: string) => {
    try {
      await deleteDocumentFromList(roomId, userId);
      setOpenMenuId(null);
    } catch (error) {
      console.error("Failed to delete document:", error);
      // You might want to show a toast notification here
    }
  };

  const renderDocumentList = (docs: DocumentDataWithOwner[]) => {
    const filtered = docs.filter((doc) =>
      doc.metadata.title.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No documents found</p>
          <p className="text-sm">
            {search
              ? "Try adjusting your search terms"
              : "Get started by creating your first lesson plan"}
          </p>
        </div>
      );
    }

    return (
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
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Last modified:{" "}
                      {new Date(
                        doc.lastConnectionAt || doc.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                    {doc.ownerName && (
                      <>
                        <span>•</span>
                        <span>Owner: {doc.ownerName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative">
                <button
                  ref={(el) => {
                    menuButtonRefs.current[doc.id] = el;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(doc.id);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                <MenuDropdown
                  anchorEl={menuButtonRefs.current[doc.id]}
                  open={openMenuId === doc.id}
                >
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
                  {doc.metadata.creatorId === userId && (
                    <DeleteModal
                      roomId={doc.id}
                      onDelete={handleDelete}
                      trigger={
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Image
                            src="/delete.svg"
                            alt="Delete"
                            width={16}
                            height={16}
                            className="mr-2"
                          />
                          Delete
                        </button>
                      }
                    />
                  )}
                </MenuDropdown>
              </div>
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex justify-center">
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

      {/* Tabs */}
      <Tabs defaultValue="my-documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="my-documents">
            My Documents ({myDocs.length})
          </TabsTrigger>
          <TabsTrigger value="shared-documents">
            Shared ({sharedDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-documents" className="mt-6">
          <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl">
            {renderDocumentList(myDocs)}
          </Card>
        </TabsContent>

        <TabsContent value="shared-documents" className="mt-6">
          <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl">
            {renderDocumentList(sharedDocs)}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
