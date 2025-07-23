import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddClassModal from "./AddClassModal";
import { UserPlus, School, Glasses } from "lucide-react";
import CreateTeamModal from "./CreateTeamModal";
import JoinSchoolModal from "./JoinSchoolModal";
import { LucideIcon } from "lucide-react";

// Add proper type annotations for ActionButton props
type ActionButtonProps = {
  icon: LucideIcon;
  children: ReactNode;
  variant?:
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ActionButton = ({
  icon: Icon,
  children,
  variant = "outline",
  ...props
}: ActionButtonProps) => (
  <Button
    variant={variant}
    className={`w-full justify-start transition-all hover:scale-[1.02] ${
      variant === "outline"
        ? "border-primary-grey-200 hover:border-primary-purple/30 hover:bg-gradient-to-r hover:from-primary-purple/5 hover:to-primary-blue/5"
        : "bg-primary-purple text-white hover:bg-primary-purple/90"
    }`}
    size="sm"
    {...props}
  >
    <Icon
      className={`h-4 w-4 mr-2 ${
        variant === "outline" ? "text-primary-purple" : "text-white"
      }`}
    />
    {children}
  </Button>
);

const ProfileActions = ({ isAdmin = false, isGoogleAccount = false }) => {
  return (
    <Card className="w-72 h-fit border-primary-grey-200 hover:border-primary-purple/30 transition-colors">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 rounded-lg">
            <School className="h-4 w-4 text-primary-purple" />
          </div>
          <CardTitle className="text-lg font-semibold text-primary-black">
            Quick Actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="flex flex-col gap-2">
          <AddClassModal />

          <Dialog>
            <DialogTrigger asChild>
              <ActionButton icon={UserPlus}>Invite Student</ActionButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary-purple" />
                  Invite a Student
                </DialogTitle>
              </DialogHeader>
              {/* Invite student form would go here */}
            </DialogContent>
          </Dialog>

          <JoinSchoolModal />

          {isGoogleAccount && (
            <Dialog>
              <DialogTrigger asChild>
                <ActionButton icon={Glasses}>
                  Sync Google Classroom
                </ActionButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    <Glasses className="h-5 w-5 text-primary-purple" />
                    Sync Google Classroom
                  </DialogTitle>
                </DialogHeader>
                {/* Add class form would go here */}
              </DialogContent>
            </Dialog>
          )}

          {/* {isAdmin && <CreateTeamModal />} */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileActions;
