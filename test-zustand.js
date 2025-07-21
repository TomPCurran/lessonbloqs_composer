#!/usr/bin/env node

/**
 * Simple Zustand Implementation Test Script
 * Run this to check for common issues in your Zustand setup
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 Testing Zustand Implementation...\n");

// Test 1: Check if Zustand store file exists
console.log("1. Checking Zustand store file...");
const storePath = path.join(__dirname, "lib", "stores", "uiStore.ts");
if (fs.existsSync(storePath)) {
  console.log("✅ uiStore.ts exists");
} else {
  console.log("❌ uiStore.ts not found");
  process.exit(1);
}

// Test 2: Check store content for notification references
console.log("\n2. Checking for notification references...");
const storeContent = fs.readFileSync(storePath, "utf8");
const notificationPatterns = [
  "addNotification",
  "removeNotification",
  "clearNotifications",
  "notifications:",
  "Notification",
  "notifyDocument",
];

let hasNotifications = false;
notificationPatterns.forEach((pattern) => {
  if (storeContent.includes(pattern)) {
    console.log(`❌ Found notification reference: ${pattern}`);
    hasNotifications = true;
  }
});

if (!hasNotifications) {
  console.log("✅ No notification references found in store");
}

// Test 3: Check for proper Zustand imports
console.log("\n3. Checking Zustand imports...");
if (storeContent.includes('import { create } from "zustand"')) {
  console.log("✅ Zustand create imported");
} else {
  console.log("❌ Zustand create not imported");
}

if (storeContent.includes('import { persist } from "zustand/middleware"')) {
  console.log("✅ Zustand persist middleware imported");
} else {
  console.log("❌ Zustand persist middleware not imported");
}

// Test 4: Check for UI state properties
console.log("\n4. Checking UI state properties...");
const uiStateProperties = [
  "isShareModalOpen",
  "isSignInModalOpen",
  "isSignUpModalOpen",
  "isDeleteModalOpen",
  "isMobileMenuOpen",
  "isSidebarOpen",
  "isLoading",
  "loadingMessage",
];

let missingProperties = [];
uiStateProperties.forEach((prop) => {
  if (!storeContent.includes(prop)) {
    missingProperties.push(prop);
  }
});

if (missingProperties.length === 0) {
  console.log("✅ All UI state properties found");
} else {
  console.log(`❌ Missing properties: ${missingProperties.join(", ")}`);
}

// Test 5: Check for setter actions
console.log("\n5. Checking setter actions...");
const setterActions = [
  "setShareModalOpen",
  "setSignInModalOpen",
  "setSignUpModalOpen",
  "setDeleteModalOpen",
  "setMobileMenuOpen",
  "setSidebarOpen",
  "setLoading",
];

let missingActions = [];
setterActions.forEach((action) => {
  if (!storeContent.includes(action)) {
    missingActions.push(action);
  }
});

if (missingActions.length === 0) {
  console.log("✅ All setter actions found");
} else {
  console.log(`❌ Missing actions: ${missingActions.join(", ")}`);
}

// Test 6: Check for persistence configuration
console.log("\n6. Checking persistence configuration...");
if (storeContent.includes("partialize: (state) => ({")) {
  console.log("✅ Persistence partialize found");
} else {
  console.log("❌ Persistence partialize not found");
}

if (storeContent.includes("isSidebarOpen: state.isSidebarOpen")) {
  console.log("✅ Sidebar persistence configured");
} else {
  console.log("❌ Sidebar persistence not configured");
}

// Test 7: Check for notification components
console.log("\n7. Checking for notification components...");
const notificationFiles = [
  "components/ui/notifications.tsx",
  "components/notifications/NotificationBell.tsx",
  "components/notifications/README.md",
];

let foundNotificationFiles = [];
notificationFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    foundNotificationFiles.push(file);
  }
});

if (foundNotificationFiles.length === 0) {
  console.log("✅ No notification components found");
} else {
  console.log(
    `❌ Found notification files: ${foundNotificationFiles.join(", ")}`
  );
}

// Test 8: Check for notification API
console.log("\n8. Checking for notification API...");
const apiPath = path.join(__dirname, "app", "api", "notifications");
if (fs.existsSync(apiPath)) {
  console.log("❌ Notification API directory still exists");
} else {
  console.log("✅ Notification API removed");
}

console.log("\n🎯 Test Summary:");
console.log(
  "If you see mostly ✅ marks, your Zustand implementation is clean!"
);
console.log("If you see ❌ marks, you may need to review those areas.");
console.log("\nNext steps:");
console.log("1. Start your dev server: npm run dev");
console.log("2. Visit http://localhost:3000");
console.log("3. Look for the Zustand Test Component in the top-left");
console.log("4. Open browser console (F12) to see state changes");
console.log('5. Test the "Toggle Sidebar" button');
console.log("6. Refresh the page to test persistence");
