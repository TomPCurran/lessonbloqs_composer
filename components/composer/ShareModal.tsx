"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Mail,
  MessageSquare,
  Check,
  Share2,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserTypeSelector from "./UserPermissionsSelector";

type UserType = "creator" | "editor" | "viewer";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fake user data for demonstration
const fakeUsers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "",
    color: "#3B82F6",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "",
    color: "#10B981",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    avatar: "",
    color: "#F59E0B",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    avatar: "",
    color: "#EF4444",
  },
  {
    id: "5",
    name: "Eva Brown",
    email: "eva@example.com",
    avatar: "",
    color: "#8B5CF6",
  },
  {
    id: "6",
    name: "Frank Miller",
    email: "frank@example.com",
    avatar: "",
    color: "#06B6D4",
  },
  {
    id: "7",
    name: "Grace Lee",
    email: "grace@example.com",
    avatar: "",
    color: "#84CC16",
  },
  {
    id: "8",
    name: "Henry Taylor",
    email: "henry@example.com",
    avatar: "",
    color: "#F97316",
  },
];

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof fakeUsers>([]);
  const [selectedUsers, setSelectedUsers] = useState<
    Array<{ user: (typeof fakeUsers)[0]; permission: UserType }>
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Handle user search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const filtered = fakeUsers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      )
      .filter(
        (user) =>
          !selectedUsers.some((selected) => selected.user.id === user.id)
      );

    setSearchResults(filtered);
  };

  // Add user to selected list
  const addUser = (user: (typeof fakeUsers)[0]) => {
    if (!selectedUsers.some((selected) => selected.user.id === user.id)) {
      setSelectedUsers((prev) => [...prev, { user, permission: "viewer" }]);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Remove user from selected list
  const removeUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.filter((selected) => selected.user.id !== userId)
    );
  };

  // Update user permission
  const updateUserPermission = (userId: string, permission: UserType) => {
    setSelectedUsers((prev) =>
      prev.map((selected) =>
        selected.user.id === userId ? { ...selected, permission } : selected
      )
    );
  };

  const handleCopyLink = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const handleEmailShare = () => {
    if (typeof window !== "undefined") {
      const subject = "Check out this lesson plan";
      const body = `I'd like to share this lesson plan with you: ${currentUrl}`;
      window.open(
        `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-8 rounded-2xl border border-border/50 shadow-xl max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-lg font-semibold">
              Share Lesson Plan
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this lesson plan with colleagues and students
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* User Search Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Add people
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-10 pr-3"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-border/50 rounded-lg max-h-32 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => addUser(user)}
                    className="flex items-center gap-3 p-2 hover:bg-accent/50 cursor-pointer border-b border-border/50 last:border-b-0"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                People with access ({selectedUsers.length})
              </label>
              <div className="space-y-2">
                {selectedUsers.map(({ user, permission }) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 border border-border/50 rounded-lg"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <UserTypeSelector
                      userType={permission}
                      setUserType={(
                        newPermission: UserType | ((prev: UserType) => UserType)
                      ) => {
                        const finalPermission =
                          typeof newPermission === "function"
                            ? newPermission(permission)
                            : newPermission;
                        updateUserPermission(user.id, finalPermission);
                      }}
                      onClickHandler={() => {}}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUser(user.id)}
                      className="p-1 h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Share link
            </label>
            <div className="flex items-center space-x-2">
              <Input
                value={currentUrl}
                readOnly
                className={cn(
                  "flex-1 text-sm bg-muted/50 border-border/50",
                  "focus-visible:ring-1 focus-visible:ring-primary/20"
                )}
                placeholder="Loading..."
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                variant="outline"
                className={cn(
                  "px-3 transition-all duration-200",
                  copied && "bg-accent text-accent-foreground"
                )}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-accent animate-in fade-in-0 duration-200">
                Link copied to clipboard!
              </p>
            )}
          </div>

          {/* Quick Share Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Quick share
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleEmailShare}
                variant="outline"
                className="justify-start hover:bg-accent/80 transition-colors duration-200"
              >
                <Mail className="h-4 w-4 mr-2" /> Email
              </Button>
              <Button
                variant="outline"
                className="justify-start hover:bg-accent/80 transition-colors duration-200"
                disabled
              >
                <MessageSquare className="h-4 w-4 mr-2" /> Message
              </Button>
            </div>
          </div>

          {/* Final Share Action */}
          <div className="pt-4 flex justify-end">
            <Button variant="default" onClick={onClose} className="px-6">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
