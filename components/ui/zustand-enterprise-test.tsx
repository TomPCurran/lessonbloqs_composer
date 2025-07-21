"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/uiStore";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { useFormStore } from "@/lib/stores/formStore";

export const ZustandEnterpriseTest: React.FC = () => {
  const {
    // UI Store
    isSidebarOpen,
    setSidebarOpen,
    isLoading,
    setLoading,
  } = useUIStore();

  const {
    // Document Store
    documents,
    filteredDocuments,
    searchQuery,
    setSearchQuery,
    currentFilter,
    setFilter,
    sortBy,
    setSortBy,
    isCreatingDocument,
    setCreatingDocument,
    addDocument,
  } = useDocumentStore();

  const {
    // Form Store
    contactForm,
    updateContactForm,
    validateContactForm,
    documentEditing,
    updateDocumentTitle,
    setDocumentEditing,
  } = useFormStore();

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("🏢 Enterprise Zustand Test Component Mounted");
    console.log("📄 Document Store State:", {
      documentsCount: documents.length,
      filteredCount: filteredDocuments.length,
      searchQuery,
      currentFilter,
      sortBy,
    });
    console.log("📝 Form Store State:", {
      contactForm: contactForm.name ? "Has data" : "Empty",
      documentEditing: documentEditing.title ? "Has title" : "No title",
    });
  }, []);

  // Test Document Store
  const handleTestDocumentStore = () => {
    console.log("📄 Testing Document Store...");

    // Test search
    setSearchQuery("test");
    console.log("🔍 Set search query to 'test'");

    // Test filter
    setFilter("my");
    console.log("🔧 Set filter to 'my'");

    // Test sort
    setSortBy("title");
    console.log("📊 Set sort to 'title'");

    // Test document operations
    const testDoc = {
      id: "test-doc-1",
      type: "lessonplan",
      metadata: {
        title: "Test Document",
        email: "test@example.com",
        creatorId: "user-1",
      },
      usersAccesses: {},
      ownerName: "Test User",
      collaborators: [],
      currentUserType: "creator" as const,
      currentUser: {
        id: "user-1",
        firstName: "Test",
        lastName: "User",
        imageUrl: "",
        email: "test@example.com",
      },
    };

    addDocument(testDoc);
    console.log("➕ Added test document");
  };

  // Test Form Store
  const handleTestFormStore = () => {
    console.log("📝 Testing Form Store...");

    // Test contact form
    updateContactForm("name", "John Doe");
    updateContactForm("email", "john@example.com");
    updateContactForm("message", "Test message");
    console.log("✏️ Updated contact form fields");

    // Test document editing
    updateDocumentTitle("Test Document Title");
    setDocumentEditing(true);
    console.log("📝 Updated document title and set editing mode");

    // Test validation
    const errors = validateContactForm();
    console.log("✅ Contact form validation errors:", errors);
  };

  // Test UI Store
  const handleTestUIStore = () => {
    console.log("🎨 Testing UI Store...");

    setSidebarOpen(!isSidebarOpen);
    console.log("🔄 Toggled sidebar");

    setLoading(true, "Testing loading state...");
    setTimeout(() => {
      setLoading(false);
      console.log("⏱️ Cleared loading state");
    }, 2000);
  };

  // Test Store Integration
  const handleTestIntegration = () => {
    console.log("🔗 Testing Store Integration...");

    // Simulate a complete workflow
    setCreatingDocument(true);
    setLoading(true, "Creating document...");

    setTimeout(() => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        type: "lessonplan",
        metadata: {
          title: "New Lesson Plan",
          email: "user@example.com",
          creatorId: "user-1",
        },
        usersAccesses: {},
        ownerName: "Current User",
        collaborators: [],
        currentUserType: "creator" as const,
        currentUser: {
          id: "user-1",
          firstName: "Current",
          lastName: "User",
          imageUrl: "",
          email: "user@example.com",
        },
      };

      addDocument(newDoc);
      setCreatingDocument(false);
      setLoading(false);

      updateDocumentTitle("New Lesson Plan");
      setDocumentEditing(true);

      console.log("✅ Complete workflow test completed");
    }, 1000);
  };

  // Reset all stores
  const handleResetAll = () => {
    console.log("🔄 Resetting all stores...");

    // Reset document store
    setSearchQuery("");
    setFilter("all");
    setSortBy("lastModified");

    // Reset form store
    updateContactForm("name", "");
    updateContactForm("email", "");
    updateContactForm("message", "");
    updateDocumentTitle("");
    setDocumentEditing(false);

    // Reset UI store
    setSidebarOpen(true);
    setLoading(false);

    console.log("✅ All stores reset");
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        🏢 Enterprise Zustand Test
      </h3>

      <div className="space-y-3">
        {/* Store Status */}
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>📄 Documents:</span>
            <span className="font-mono">{documents.length}</span>
          </div>
          <div className="flex justify-between">
            <span>🔍 Search:</span>
            <span className="font-mono text-xs">{searchQuery || "none"}</span>
          </div>
          <div className="flex justify-between">
            <span>📝 Form:</span>
            <span className="font-mono text-xs">
              {contactForm.name ? "has data" : "empty"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>🎨 Sidebar:</span>
            <span
              className={`font-mono ${
                isSidebarOpen ? "text-green-600" : "text-red-600"
              }`}
            >
              {isSidebarOpen ? "open" : "closed"}
            </span>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleTestDocumentStore}
            size="sm"
            className="w-full"
          >
            📄 Test Document Store
          </Button>

          <Button onClick={handleTestFormStore} size="sm" className="w-full">
            📝 Test Form Store
          </Button>

          <Button onClick={handleTestUIStore} size="sm" className="w-full">
            🎨 Test UI Store
          </Button>

          <Button
            onClick={handleTestIntegration}
            size="sm"
            className="w-full"
            variant="outline"
          >
            🔗 Test Integration
          </Button>

          <Button
            onClick={handleResetAll}
            size="sm"
            className="w-full"
            variant="destructive"
          >
            🔄 Reset All
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="text-xs space-y-1">
          {isLoading && (
            <div className="text-blue-600 dark:text-blue-400">
              ⏱️ Loading: {isLoading}
            </div>
          )}
          {isCreatingDocument && (
            <div className="text-orange-600 dark:text-orange-400">
              📄 Creating document...
            </div>
          )}
          {documentEditing.isEditing && (
            <div className="text-green-600 dark:text-green-400">
              ✏️ Document editing mode
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
