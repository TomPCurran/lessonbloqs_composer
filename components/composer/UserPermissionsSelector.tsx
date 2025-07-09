import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  const handleTypeChange = (type: UserType) => {
    if (disabled) return;
    setUserType(type);
    onClickHandler?.(type);
  };

  return (
    <div className="inline-block relative">
      <Select
        value={userType}
        onValueChange={handleTypeChange}
        disabled={disabled}
      >
        <SelectTrigger
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 w-48 flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500 transition-colors disabled:opacity-50"
          disabled={disabled}
        >
          <SelectValue placeholder="Select access..." />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg mt-2">
          <SelectItem
            value="viewer"
            className="py-2 px-3 hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer"
          >
            Can View
          </SelectItem>
          <SelectItem
            value="editor"
            className="py-2 px-3 hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer"
          >
            Can Edit
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserTypeSelector;
