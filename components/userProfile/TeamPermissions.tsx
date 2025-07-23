"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, UserPlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/useToast";
import { useTeamMembers } from "@/hooks/useTeams";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useGetTeamMembersQuery } from "@/store/api/endpoints/teamEndpoints";
import { useAppSelector } from "@/store/hooks";
import { apiErrorHandler } from "@/store/api/apiErrorHandler";

interface TeamPermissionsProps {
  teamId: string;
}

interface SelectedMemberWithRole {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "Admin" | "Member" | "Viewer";
}

const TeamPermissions = ({ teamId }: TeamPermissionsProps) => {
  const { toast } = useToast();

  // Get schoolIds from Redux store instead of props
  const userData = useAppSelector((state) => state.user.currentUser);
  const schoolIds = userData?.schools?.map((school) => school.id) || [];

  // Fetch team members data
  const {
    data: members,
    isLoading,
    error,
  } = useGetTeamMembersQuery(
    { teamId },
    {
      skip: !teamId,
      refetchOnMountOrArgChange: true,
    }
  );

  if (isLoading) return <div>Loading team members...</div>;

  if (error) {
    return (
      <div className="p-3 bg-red-50 rounded border border-red-200 my-2">
        <p className="text-sm text-red-600">
          {apiErrorHandler.getErrorMessage(error)}
        </p>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return <div>No team members found</div>;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<
    SelectedMemberWithRole[]
  >([]);

  // Filter organization members to exclude members already in the team
  const filteredOrgMembers = useMemo(() => {
    return members.filter(
      (orgMember) =>
        !members?.some((teamMember) => teamMember.email === orgMember.email)
    );
  }, [members]);

  // Search organization members by name or email
  const searchedOrgMembers = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase().trim();

    if (!searchTermLower) return []; // Return empty array when no search term

    return filteredOrgMembers.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const email = member.email.toLowerCase();

      return (
        fullName.includes(searchTermLower) || email.includes(searchTermLower)
      );
    });
  }, [filteredOrgMembers, searchTerm]);

  const handleRoleChange = (
    memberId: string,
    newRole: "Admin" | "Member" | "Viewer"
  ) => {
    // For selected members that aren't added to the team yet
    if (selectedMembers.some((m) => m.id === memberId)) {
      setSelectedMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
      return;
    }

    // For existing team members
    updateMemberRole(memberId, newRole)
      .then((success) => {
        if (success) {
          toast({
            title: "Success",
            description: "Member role updated successfully",
          });
          refetch();
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to update member role",
          variant: "destructive",
        });
      });
  };

  const handleMemberStatusChange = async (
    userId: string,
    isActive: boolean
  ) => {
    toggleMemberStatus(userId, isActive)
      .then((success) => {
        if (success) {
          toast({
            title: "Success",
            description: `Member ${
              isActive ? "activated" : "deactivated"
            } successfully`,
          });
          refetch();
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to update member status",
          variant: "destructive",
        });
      });
  };

  const handleMemberSelect = (member: (typeof filteredOrgMembers)[0]) => {
    setSelectedMembers((prev) => [
      ...prev,
      {
        id: member.id,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        role: "Viewer",
      },
    ]);
    setSearchTerm("");
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.filter((member) => member.id !== memberId)
    );
  };

  const handleInviteSelected = async () => {
    try {
      // Process members sequentially
      for (const member of selectedMembers) {
        await addTeamMember(member.id, member.role);
      }

      toast({
        title: "Success",
        description: "Team members added successfully",
      });

      setSelectedMembers([]);
      setIsInviteDialogOpen(false);
      refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add some team members",
        variant: "destructive",
      });
    }
  };

  // Debug outputs

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary-black">
          Team Members
        </h3>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-purple hover:bg-primary-purple/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Search for organization members by name or email
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <Input
                type="text"
                placeholder="Start typing to search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
              />
              {searchTerm.trim() !== "" && (
                <div className="absolute w-full bg-white border rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
                  {isLoading ? (
                    <p className="p-2">Loading organization members...</p>
                  ) : error ? (
                    <p className="p-2">Error fetching organization members</p>
                  ) : searchedOrgMembers.length === 0 ? (
                    <p className="p-2 text-sm text-primary-grey-300">
                      No matching members found
                    </p>
                  ) : (
                    <ul className="py-1">
                      {searchedOrgMembers.map((member) => (
                        <li
                          key={`search-${member.id}-${teamId}`}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleMemberSelect(member)}
                        >
                          <p className="font-medium text-primary-black">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-sm text-primary-grey-300">
                            {member.email}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Selected Members:</h4>
              {selectedMembers.length === 0 ? (
                <p className="text-sm text-primary-grey-300">
                  No members selected
                </p>
              ) : (
                <ul className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                  {selectedMembers.map((member) => (
                    <li
                      key={`selected-${member.id}-${teamId}`}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-primary-black">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-primary-grey-300">
                          {member.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              {member.role}{" "}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member.id, "Admin")
                              }
                            >
                              Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member.id, "Member")
                              }
                            >
                              Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member.id, "Viewer")
                              }
                            >
                              Viewer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleInviteSelected}
                disabled={selectedMembers.length === 0}
                className="bg-primary-purple hover:bg-primary-purple/90"
              >
                Invite Selected Members
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={`${member.id}-${teamId}`}>
              <TableCell>
                {member.first_name || member.firstName}{" "}
                {member.last_name || member.lastName}
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {member.role || member.member_role}{" "}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(member.id, "Admin")}
                    >
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(member.id, "Member")}
                    >
                      Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(member.id, "Viewer")}
                    >
                      Viewer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <Switch
                  checked={member.is_active}
                  disabled={isLoading}
                  onCheckedChange={(checked) =>
                    handleMemberStatusChange(member.id, checked)
                  }
                  className={isLoading ? "opacity-50" : ""}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamPermissions;
