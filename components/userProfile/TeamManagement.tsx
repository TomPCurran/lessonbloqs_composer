"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import TeamPermissions from "./TeamPermissions";
import { useTeams } from "@/hooks/useTeams"; // Use named import when the hook is exported with "export const"
import { apiErrorHandler } from "@/store/api/apiErrorHandler";

// Interface for Team moved to types file

const TeamManagement = () => {
  // Use the custom hook instead of direct RTK Query hooks
  const { teams, isLoading, error, updateTeamActiveStatus, isUpdatingTeam } =
    useTeams();

  // Handle team status toggle
  const handleTeamStatusChange = async (teamId: string, isActive: boolean) => {
    try {
      await updateTeamActiveStatus({ teamId, isActive });
    } catch (err) {
      apiErrorHandler.logError(err);
    }
  };

  // 🔹 Handle loading and error states
  if (isLoading) return <div>Loading teams...</div>;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{apiErrorHandler.getErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="p-6 border-primary-grey-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-purple" />
            <h2 className="text-2xl font-semibold text-primary-black">Teams</h2>
          </div>
        </div>

        {/* 🔹 Display all teams */}
        <Accordion type="single" collapsible className="space-y-4">
          {teams?.map((team) => (
            <AccordionItem
              key={team.id}
              value={`team-${team.id}`}
              className="border border-primary-grey-200 rounded-lg px-4"
            >
              <div className="flex items-center justify-between py-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-primary-black">
                      {team.name}
                    </span>
                    <div className="flex gap-2 text-sm text-primary-grey-300">
                      <span>
                        Created:{" "}
                        {new Date(team.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        Updated:{" "}
                        {new Date(team.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <Switch
                  checked={team.is_active}
                  disabled={isUpdatingTeam}
                  onCheckedChange={(checked) =>
                    handleTeamStatusChange(team.id, checked)
                  }
                  className={`bg-primary-grey-200 data-[state=checked]:bg-primary-purple ${
                    isUpdatingTeam ? "opacity-50" : ""
                  }`}
                />
              </div>

              {/* TeamPermissions Component */}
              <AccordionContent>
                <TeamPermissions teamId={team.id} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

export default TeamManagement;
