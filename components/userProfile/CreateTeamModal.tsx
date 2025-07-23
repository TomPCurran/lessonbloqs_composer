"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { X, Users, UserCircle, Hash } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useTeamCreator } from "@/hooks/useTeams";
import { useOrganizations } from "@/hooks/useOrganizations";

// Define types
interface Member {
  user_id: string;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "Admin" | "Member" | "Viewer";
}

const CreateTeamModal = () => {
  const { toast } = useToast();
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    schools,
    isLoading: loadingUsers,
    error: usersError,
    filterMembers,
  } = useOrganizations();

  const { createTeam, isLoading: isCreating } = useTeamCreator();

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return [];

    const filtered = filterMembers(searchTerm);
    return filtered.filter(
      (user) => !selectedMembers.some((member) => member.user_id === user.id)
    );
  }, [searchTerm, filterMembers, selectedMembers]);

  const resetModal = useCallback(() => {
    setTeamName("");
    setSelectedMembers([]);
    setSearchTerm("");
    setShowResults(false);
    setSelectedSchool("");
  }, []);

  const handleAddMember = useCallback(
    (user: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    }) => {
      setSelectedMembers((prev: Member[]) => [
        ...prev,
        {
          user_id: user.id,
          id: user.id,
          first_name: user.firstName || "",
          last_name: user.lastName || "",
          email: user.email || "",
          role: "Member",
        },
      ]);
      setSearchTerm("");
      setShowResults(false);
    },
    []
  );

  const handleRemoveMember = useCallback((userId: string) => {
    setSelectedMembers((prev: Member[]) =>
      prev.filter((member) => member.user_id !== userId)
    );
  }, []);

  const handleRoleChange = useCallback((userId: string, newRole: string) => {
    setSelectedMembers((prev: Member[]) =>
      prev.map((member) =>
        member.user_id === userId
          ? { ...member, role: newRole as "Admin" | "Member" | "Viewer" }
          : member
      )
    );
  }, []);

  const validateInput = useCallback((): boolean => {
    if (!teamName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedSchool) {
      toast({
        title: "Missing Information",
        description: "Please select a school",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [teamName, selectedSchool, toast]);

  const handleCreateTeam = useCallback(async () => {
    if (!validateInput()) return;

    try {
      const success = await createTeam(
        teamName,
        selectedSchool,
        selectedMembers.map((m) => ({
          id: m.user_id,
          member_role: m.role,
        }))
      );

      if (success) {
        toast({
          title: "Success",
          description: "Team created successfully!",
        });
        resetModal();
        setIsOpen(false);
      }
    } catch (error: unknown) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create team. Please try again.",
        variant: "destructive",
      });
    }
  }, [
    validateInput,
    selectedMembers,
    createTeam,
    teamName,
    selectedSchool,
    toast,
    resetModal,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // For security, sanitize input before displaying it
  const sanitizeText = useCallback((text: string): string => {
    return text ? String(text).replace(/[^\w\s@.-]/gi, "") : "";
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) resetModal();
    },
    [resetModal]
  );

  // Handle dialog button click separately to avoid state updates during render
  const handleDialogButtonClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start border-primary-grey-200 hover:border-primary-purple/30 hover:bg-gradient-to-r hover:from-primary-purple/5 hover:to-primary-blue/5"
          size="sm"
          onClick={handleDialogButtonClick}
          aria-label="Create Team"
        >
          <Users className="h-4 w-4 mr-2 text-primary-purple" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[625px] p-0 overflow-hidden"
        aria-describedby="create-team-description"
      >
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-primary-purple to-primary-blue rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-primary-black">
              Create a New Team
            </DialogTitle>
            <p id="create-team-description" className="sr-only">
              Form to create a new team with custom name, school selection, and
              team members
            </p>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Team Details Card */}
          <Card className="p-4 border-primary-grey-200 hover:border-primary-purple/30 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-4 w-4 text-primary-purple" />
              <h3 className="font-medium text-primary-black">Team Details</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value.slice(0, 100))} // Limit input length
                  className="bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20"
                  aria-label="Team name"
                  maxLength={100}
                  required
                />
              </div>
            </div>
          </Card>

          {/* School Selection Card */}
          <Card className="p-4 border-primary-grey-200 hover:border-primary-purple/30 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-4 w-4 text-primary-purple" />
              <h3 className="font-medium text-primary-black">Select School</h3>
            </div>
            <div className="space-y-2">
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="w-full bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20">
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {sanitizeText(school.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Team Members Card */}
          <Card className="p-4 border-primary-grey-200 hover:border-primary-purple/30 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle className="h-4 w-4 text-primary-purple" />
              <h3 className="font-medium text-primary-black">Team Members</h3>
            </div>
            {loadingUsers ? (
              <div className="text-center py-4">Loading members...</div>
            ) : usersError ? (
              <div className="text-center py-4 text-red-500">
                Error loading members. Please refresh or try again later.
                {typeof usersError === "string" && (
                  <p className="mt-1 text-xs">{usersError}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative" ref={searchRef}>
                  <Input
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value.slice(0, 50)); // Limit input length
                      setShowResults(Boolean(e.target.value));
                    }}
                    onFocus={() => setShowResults(Boolean(searchTerm))}
                    placeholder="Search by name or email"
                    className="bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20"
                    aria-label="Search members"
                    maxLength={50}
                  />
                  {showResults && filteredUsers.length > 0 && (
                    <div className="absolute w-full bg-white border border-primary-grey-200 rounded-lg shadow-lg z-[100] mt-1 max-h-[300px] overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <div
                          key={`search-${user.id}`}
                          onClick={() => handleAddMember(user)}
                          className="p-3 hover:bg-gradient-to-r hover:from-primary-purple/5 hover:to-primary-blue/5 cursor-pointer transition-colors"
                          role="button"
                          tabIndex={0}
                          aria-label={`Add ${user.firstName} ${user.lastName}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleAddMember(user);
                            }
                          }}
                        >
                          <p className="font-medium text-primary-black">
                            {sanitizeText(user.firstName)}{" "}
                            {sanitizeText(user.lastName)}
                          </p>
                          <p className="text-sm text-primary-grey-300">
                            {sanitizeText(user.email)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {showResults && filteredUsers.length === 0 && searchTerm && (
                    <div className="absolute w-full bg-white border border-primary-grey-200 rounded-lg shadow-lg z-[100] mt-1 p-3">
                      No matching users found
                    </div>
                  )}
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {selectedMembers.map((member) => (
                    <div
                      key={`member-${member.user_id}`}
                      className="flex items-center justify-between p-3 bg-primary-grey-100 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-primary-black">
                          {sanitizeText(member.first_name)}{" "}
                          {sanitizeText(member.last_name)}
                        </p>
                        <p className="text-sm text-primary-grey-300">
                          {sanitizeText(member.email)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            handleRoleChange(member.user_id, value)
                          }
                        >
                          <SelectTrigger className="w-[110px] bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20">
                            <SelectValue placeholder={member.role} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.user_id)}
                          className="hover:bg-primary-purple/10 hover:text-primary-purple"
                          aria-label={`Remove ${member.first_name} ${member.last_name}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="p-6 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 border-t border-primary-grey-200">
          <Button
            onClick={handleCreateTeam}
            disabled={isCreating || loadingUsers}
            className="w-full bg-primary-purple hover:bg-primary-purple/90 transition-colors"
            aria-label="Create Team"
          >
            {isCreating ? "Creating Team..." : "Create Team"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamModal;
