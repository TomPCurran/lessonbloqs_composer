"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  List,
  FileText,
  MoreVertical,
  UploadCloud,
  Copy,
  Share2,
  Archive,
} from "lucide-react";
import AddDocumentBtn from "@/components/AddDocumentButton";
import { DeleteModal } from "@/components/DeleteModal";
import { getDocuments } from "@/lib/actions/room.actions";

interface LessonPlan {
  id: string;
  title: string;
  updatedAt: string;
}

// Import DocumentData type from types file
type DocumentData = {
  type: string;
  id: string;
  tenantId: string;
  lastConnectionAt: string;
  createdAt: string;
  metadata: {
    email: string;
    title: string;
    creatorId: string;
  };
  defaultAccesses: string[];
  groupsAccesses: Record<string, never>;
  usersAccesses: Record<string, string[]>;
};

export default function LessonPlansListPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [search, setSearch] = useState("");
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!isLoaded || !user) return;

    try {
      const documents = await getDocuments(user.emailAddresses[0].emailAddress);

      console.log(documents);

      // Check if documents is an array and has items
      if (documents && Array.isArray(documents) && documents.length > 0) {
        const formattedPlans = documents.map((doc: DocumentData) => ({
          id: doc.id,
          title: doc.metadata?.title || "Untitled",
          updatedAt:
            doc.lastConnectionAt || doc.createdAt || new Date().toISOString(),
        }));
        setPlans(formattedPlans);
      } else {
        // No documents found, set empty array
        setPlans([]);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      setPlans([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filtered = plans.filter((plan) =>
    plan.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMenu = (id: string) =>
    setOpenMenuId(openMenuId === id ? null : id);

  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your documents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Header */}
      <Card className="bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex items-center gap-3">
          <List className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Your Lesson Plans
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* AddDocumentBtn now handles user data internally */}
          <AddDocumentBtn />
          <button
            onClick={() => {
              /* placeholder upload */
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner hover:shadow-sm transition-shadow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            <UploadCloud className="w-5 h-5 text-primary" />
            <span>Upload Lesson Plan</span>
          </button>
        </div>
      </Card>

      {/* Search Bar */}
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

      {/* Lesson Plans List */}
      <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filtered.length === 0 && plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No lesson plans yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Create your first lesson plan to get started
              </p>
              <AddDocumentBtn />
            </div>
          ) : filtered.length === 0 && search ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No matching lesson plans
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            filtered.map((plan) => (
              <div key={plan.id} className="relative group">
                <div
                  onClick={() => router.push(`/lessonplans/${plan.id}`)}
                  className="flex items-center justify-between px-6 py-4 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-lg font-medium truncate">
                        {plan.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last modified:{" "}
                        {new Date(plan.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(plan.id);
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openMenuId === plan.id && (
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
                        <DeleteModal roomId={plan.id} />
                      </div>
                    )}
                  </div>

                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
