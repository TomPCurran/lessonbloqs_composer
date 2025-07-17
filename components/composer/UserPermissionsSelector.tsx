import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Eye, Edit, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type UserType = "creator" | "editor" | "viewer";

interface UserTypeSelectorParams {
  userType: string;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  onClickHandler?: (value: string) => void;
  disabled?: boolean;
}

const UserTypeSelector = ({
  userType,
  setUserType,
  onClickHandler,
  disabled = false,
}: UserTypeSelectorParams) => {
  console.log("[UserPermissionsSelector] render", { userType, disabled });
  const handleTypeChange = (type: UserType) => {
    if (disabled) return;
    setUserType(type);
    onClickHandler?.(type);
  };

  const getPermissionConfig = (type: string) => {
    switch (type) {
      case "editor":
        return {
          icon: <Edit className="w-4 h-4" />,
          label: "Can Edit",
          description: "Edit and comment",
          color: "text-secondary",
        };
      case "viewer":
        return {
          icon: <Eye className="w-4 h-4" />,
          label: "Can View",
          description: "View only",
          color: "text-muted-foreground",
        };
      default:
        return {
          icon: <Eye className="w-4 h-4" />,
          label: "Select access...",
          description: "",
          color: "text-muted-foreground",
        };
    }
  };

  const currentConfig = getPermissionConfig(userType);

  return (
    <Select
      value={userType}
      onValueChange={handleTypeChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "google-input h-10 w-48 gap-grid-2",
          "hover:border-ring focus:border-ring transition-colors duration-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-grid-2 flex-1">
          <span
            className={cn(
              "transition-colors duration-200",
              currentConfig.color
            )}
          >
            {currentConfig.icon}
          </span>
          <div className="flex flex-col items-start">
            <span className="text-body-medium text-foreground">
              {currentConfig.label}
            </span>
            {currentConfig.description && (
              <span className="text-body-small text-muted-foreground">
                {currentConfig.description}
              </span>
            )}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
      </SelectTrigger>

      <SelectContent
        className={cn(
          "google-card border-border/50 elevation-3 animate-scale-in",
          "min-w-[12rem] p-1"
        )}
      >
        <SelectItem
          value="viewer"
          className={cn(
            "google-button-ghost p-grid-2 cursor-pointer rounded-md",
            "hover:bg-muted focus:bg-muted transition-colors duration-200",
            "data-[highlighted]:bg-muted"
          )}
        >
          <div className="flex items-center gap-grid-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col space-grid-1">
              <span className="text-body-medium text-foreground">Can View</span>
              <span className="text-body-small text-muted-foreground">
                View and comment only
              </span>
            </div>
          </div>
        </SelectItem>

        <SelectItem
          value="editor"
          className={cn(
            "google-button-ghost p-grid-2 cursor-pointer rounded-md",
            "hover:bg-muted focus:bg-muted transition-colors duration-200",
            "data-[highlighted]:bg-muted"
          )}
        >
          <div className="flex items-center gap-grid-2">
            <Edit className="w-4 h-4 text-secondary" />
            <div className="flex flex-col space-grid-1">
              <span className="text-body-medium text-foreground">Can Edit</span>
              <span className="text-body-small text-muted-foreground">
                Edit, comment, and share
              </span>
            </div>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserTypeSelector;
