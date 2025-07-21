"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/uiStore";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { useFormStore } from "@/lib/stores/formStore";

export const ZustandTest: React.FC = () => {
  const {
    // UI Store
    isShareModalOpen,
    isSignInModalOpen,
    isSignUpModalOpen,
    isDeleteModalOpen,
    isMobileMenuOpen,
    isSidebarOpen,
    isLoading,
    loadingMessage,
    setShareModalOpen,
    setSignInModalOpen,
    setSignUpModalOpen,
    setDeleteModalOpen,
    setMobileMenuOpen,
    setSidebarOpen,
    setLoading,
  } = useUIStore();

  const {
    // Document Store
    documents,
    searchQuery,
    setSearchQuery,
    currentFilter,
    setFilter,
    sortBy,
    setSortBy,
    setCreatingDocument,
    addDocument,
    removeDocument,
  } = useDocumentStore();

  const {
    // Form Store
    contactForm,
    updateContactForm,
    setContactFormErrors,
    validateContactForm,
    documentEditing,
    updateDocumentTitle,
    setDocumentEditing,
  } = useFormStore();

  // Debug: Log when component mounts and state changes
  useEffect(() => {
    console.log("🎯 Zustand Test Component Mounted");
    console.log("🎯 Current sidebar state:", isSidebarOpen);

    // Log the entire store state
    const storeState = useUIStore.getState();
    console.log("🎯 Full Zustand store state:", storeState);
  }, [isSidebarOpen]);

  // Test all state changes
  const handleToggleSidebar = () => {
    console.log(
      "🎯 Toggling sidebar from:",
      isSidebarOpen,
      "to:",
      !isSidebarOpen
    );
    setSidebarOpen(!isSidebarOpen);
  };

  const handleToggleShareModal = () => {
    console.log(
      "🎯 Toggling share modal from:",
      isShareModalOpen,
      "to:",
      !isShareModalOpen
    );
    setShareModalOpen(!isShareModalOpen);
  };

  const handleToggleSignInModal = () => {
    console.log(
      "🎯 Toggling sign-in modal from:",
      isSignInModalOpen,
      "to:",
      !isSignInModalOpen
    );
    setSignInModalOpen(!isSignInModalOpen);
  };

  const handleToggleSignUpModal = () => {
    console.log(
      "🎯 Toggling sign-up modal from:",
      isSignUpModalOpen,
      "to:",
      !isSignUpModalOpen
    );
    setSignUpModalOpen(!isSignUpModalOpen);
  };

  const handleToggleDeleteModal = () => {
    console.log(
      "🎯 Toggling delete modal from:",
      isDeleteModalOpen,
      "to:",
      !isDeleteModalOpen
    );
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleToggleMobileMenu = () => {
    console.log(
      "🎯 Toggling mobile menu from:",
      isMobileMenuOpen,
      "to:",
      !isMobileMenuOpen
    );
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTestLoading = () => {
    console.log("🎯 Testing loading state");
    setLoading(true, "Testing loading state...");

    // Auto-clear loading after 3 seconds
    setTimeout(() => {
      console.log("🎯 Clearing loading state");
      setLoading(false);
    }, 3000);
  };

  const handleTestLongLoading = () => {
    console.log("🎯 Testing long loading state");
    setLoading(true, "This is a longer loading message for testing...");

    // Auto-clear loading after 5 seconds
    setTimeout(() => {
      console.log("🎯 Clearing long loading state");
      setLoading(false);
    }, 5000);
  };

  const handleResetAllModals = () => {
    console.log("🎯 Resetting all modal states");
    setShareModalOpen(false);
    setSignInModalOpen(false);
    setSignUpModalOpen(false);
    setDeleteModalOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogCurrentState = () => {
    const currentState = useUIStore.getState();
    console.log("🎯 Current Zustand State:", currentState);
  };

  const handleTestPersistence = () => {
    console.log("🎯 Testing persistence - setting sidebar to closed");
    setSidebarOpen(false);
    console.log("🎯 Now refresh the page to test if sidebar state persists");
  };

  // Document Store Tests
  const handleTestDocumentSearch = () => {
    console.log("📄 Testing document search");
    setSearchQuery("test search");
    console.log("🔍 Set search query to 'test search'");
  };

  const handleTestDocumentFilter = () => {
    console.log("📄 Testing document filter");
    setFilter(currentFilter === "all" ? "my" : "all");
    console.log(
      "🔧 Toggled filter to:",
      currentFilter === "all" ? "my" : "all"
    );
  };

  const handleTestDocumentSort = () => {
    console.log("📄 Testing document sort");
    setSortBy(sortBy === "title" ? "lastModified" : "title");
    console.log(
      "📊 Toggled sort to:",
      sortBy === "title" ? "lastModified" : "title"
    );
  };

  const handleTestAddDocument = () => {
    console.log("📄 Testing add document");
    const testDoc = {
      id: `test-doc-${Date.now()}`,
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
    console.log("➕ Added test document:", testDoc.id);
  };

  const handleTestRemoveDocument = () => {
    console.log("📄 Testing remove document");
    if (documents.length > 0) {
      const docToRemove = documents[0];
      removeDocument(docToRemove.id);
      console.log("🗑️ Removed document:", docToRemove.id);
    } else {
      console.log("📄 No documents to remove");
    }
  };

  // Form Store Tests
  const handleTestContactForm = () => {
    console.log("📝 Testing contact form");
    updateContactForm("name", "John Doe");
    updateContactForm("email", "john@example.com");
    updateContactForm("message", "Test message");
    console.log("✏️ Updated contact form fields");
  };

  const handleTestFormValidation = () => {
    console.log("📝 Testing form validation");
    const errors = validateContactForm();
    console.log("✅ Contact form validation errors:", errors);
    setContactFormErrors(errors);
  };

  const handleTestDocumentEditing = () => {
    console.log("📝 Testing document editing");
    updateDocumentTitle("Test Document Title");
    setDocumentEditing(true);
    console.log("📝 Updated document title and set editing mode");
  };

  // Integration Tests
  const handleTestIntegration = () => {
    console.log("🔗 Testing store integration");

    // Test document operations
    setCreatingDocument(true);
    setLoading(true, "Creating document...");

    setTimeout(() => {
      const testDoc = {
        id: `integration-doc-${Date.now()}`,
        type: "lessonplan",
        metadata: {
          title: "Integration Test Document",
          email: "integration@example.com",
          creatorId: "user-1",
        },
        usersAccesses: {},
        ownerName: "Integration User",
        collaborators: [],
        currentUserType: "creator" as const,
        currentUser: {
          id: "user-1",
          firstName: "Integration",
          lastName: "User",
          imageUrl: "",
          email: "integration@example.com",
        },
      };

      addDocument(testDoc);
      setCreatingDocument(false);
      setLoading(false);

      // Test form integration
      updateDocumentTitle("Integration Test Document");
      setDocumentEditing(true);

      console.log("✅ Integration test completed");
    }, 1000);
  };

  const handleResetAllStores = () => {
    console.log("🔄 Resetting all stores");

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
    <div className="p-4 space-y-4 border rounded-lg bg-background max-w-md">
      <h3 className="text-lg font-semibold">Zustand Test Component</h3>

      {/* Current State Display */}
      <div className="space-y-2 p-3 bg-muted rounded-md">
        <h4 className="text-sm font-medium">Current State:</h4>
        <div className="text-xs space-y-1">
          {/* UI Store State */}
          <div className="font-medium text-blue-600">🎨 UI Store:</div>
          <div>
            Sidebar:{" "}
            <span
              className={`font-medium ${
                isSidebarOpen ? "text-green-600" : "text-red-600"
              }`}
            >
              {isSidebarOpen ? "Open" : "Closed"}
            </span>
          </div>
          <div>
            Loading:{" "}
            <span
              className={`font-medium ${
                isLoading ? "text-green-600" : "text-red-600"
              }`}
            >
              {isLoading ? `Yes (${loadingMessage})` : "No"}
            </span>
          </div>

          {/* Document Store State */}
          <div className="font-medium text-blue-600 mt-2">
            📄 Document Store:
          </div>
          <div>
            Documents: <span className="font-medium">{documents.length}</span>
          </div>
          <div>
            Search: <span className="font-medium">{searchQuery || "none"}</span>
          </div>
          <div>
            Filter: <span className="font-medium">{currentFilter}</span>
          </div>
          <div>
            Sort: <span className="font-medium">{sortBy}</span>
          </div>

          {/* Form Store State */}
          <div className="font-medium text-blue-600 mt-2">📝 Form Store:</div>
          <div>
            Contact Form:{" "}
            <span className="font-medium">
              {contactForm.name ? "has data" : "empty"}
            </span>
          </div>
          <div>
            Document Editing:{" "}
            <span className="font-medium">
              {documentEditing.isEditing ? "editing" : "not editing"}
            </span>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="space-y-3">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Modal Tests:</h4>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleToggleSidebar} variant="outline" size="sm">
              Toggle Sidebar
            </Button>
            <Button
              onClick={handleToggleShareModal}
              variant="outline"
              size="sm"
            >
              Toggle Share Modal
            </Button>
            <Button
              onClick={handleToggleSignInModal}
              variant="outline"
              size="sm"
            >
              Toggle Sign In
            </Button>
            <Button
              onClick={handleToggleSignUpModal}
              variant="outline"
              size="sm"
            >
              Toggle Sign Up
            </Button>
            <Button
              onClick={handleToggleDeleteModal}
              variant="outline"
              size="sm"
            >
              Toggle Delete Modal
            </Button>
            <Button
              onClick={handleToggleMobileMenu}
              variant="outline"
              size="sm"
            >
              Toggle Mobile Menu
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Loading Tests:</h4>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleTestLoading} variant="default" size="sm">
              Test Loading (3s)
            </Button>
            <Button onClick={handleTestLongLoading} variant="default" size="sm">
              Test Long Loading (5s)
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Document Store Tests:</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleTestDocumentSearch}
              variant="outline"
              size="sm"
            >
              Test Search
            </Button>
            <Button
              onClick={handleTestDocumentFilter}
              variant="outline"
              size="sm"
            >
              Test Filter
            </Button>
            <Button
              onClick={handleTestDocumentSort}
              variant="outline"
              size="sm"
            >
              Test Sort
            </Button>
            <Button onClick={handleTestAddDocument} variant="outline" size="sm">
              Add Document
            </Button>
            <Button
              onClick={handleTestRemoveDocument}
              variant="outline"
              size="sm"
            >
              Remove Document
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Form Store Tests:</h4>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleTestContactForm} variant="outline" size="sm">
              Test Contact Form
            </Button>
            <Button
              onClick={handleTestFormValidation}
              variant="outline"
              size="sm"
            >
              Test Validation
            </Button>
            <Button
              onClick={handleTestDocumentEditing}
              variant="outline"
              size="sm"
            >
              Test Document Editing
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Integration Tests:</h4>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleTestIntegration} variant="default" size="sm">
              Test Integration
            </Button>
            <Button
              onClick={handleResetAllStores}
              variant="destructive"
              size="sm"
            >
              Reset All Stores
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Utility Tests:</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleResetAllModals}
              variant="destructive"
              size="sm"
            >
              Reset All Modals
            </Button>
            <Button
              onClick={handleLogCurrentState}
              variant="secondary"
              size="sm"
            >
              Log State
            </Button>
            <Button
              onClick={handleTestPersistence}
              variant="secondary"
              size="sm"
            >
              Test Persistence
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>✅ Open browser console (F12) to see detailed logs</p>
        <p>✅ Test persistence by refreshing the page after toggling sidebar</p>
        <p>
          ✅ Test document store: search, filter, sort, add/remove documents
        </p>
        <p>✅ Test form store: contact form, validation, document editing</p>
        <p>✅ Test integration: complete workflow simulation</p>
        <p>✅ Verify all states update correctly in real-time</p>
      </div>
    </div>
  );
};
