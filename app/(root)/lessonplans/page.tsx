"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  List,
  FileText,
  Plus,
  MoreVertical,
  UploadCloud,
  Copy,
  Share2,
  Archive,
} from "lucide-react";
import AddDocumentBtn from "@/components/AddDocumentButton";
import { DeleteModal } from "@/components/DeleteModal";

interface LessonPlan {
  id: string;
  title: string;
  updatedAt: string;
}

export default function LessonPlansListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    // TODO: fetch user's actual plans
    setPlans([
      { id: "1", title: "Biology Basics", updatedAt: "2025-07-07T10:30:00Z" },
      { id: "2", title: "Chemistry 101", updatedAt: "2025-07-06T14:20:00Z" },
      { id: "3", title: "World History", updatedAt: "2025-07-05T09:15:00Z" },
    ]);
  }, []);

  const filtered = plans.filter((plan) =>
    plan.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMenu = (id: string) =>
    setOpenMenuId(openMenuId === id ? null : id);

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
          {/* Replace manual new-button with AddDocumentBtn */}
          <AddDocumentBtn userId="" email="" />
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
          {filtered.map((plan) => (
            <div key={plan.id} className="relative group">
              <div
                onClick={() => router.push(`/lessonplans/${plan.id}`)}
                className="flex items-center justify-between px-6 py-4 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-lg font-medium truncate">{plan.title}</p>
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
          ))}

          {/* New Plan Row */}
          <div
            onClick={() => router.push("/lessonplans/new")}
            className="relative group flex items-center space-x-4 px-6 py-4 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400 dark:border-gray-500">
              <Plus className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-lg font-medium">Create New Lesson Plan</p>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>
      </Card>
    </div>
  );
}
