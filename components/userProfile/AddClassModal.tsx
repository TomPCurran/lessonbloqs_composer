"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  School,
  CalendarDays,
  BookOpen,
  Users,
  Glasses,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCreateClassMutation } from "@/store/api/endpoints/classEndpoints";
import { addClass } from "@/store/features/classesSlice";
import type { RootState } from "@/store/types/RootState";

const AddClassModal: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Literature",
    "Art",
    "Music",
    "Other",
  ];
  const levels = [
    "Regular",
    "Advanced",
    "AP",
    "IB",
    "Honors",
    "College",
    "Other",
  ];
  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const [createClass, { isLoading }] = useCreateClassMutation();

  const [formData, setFormData] = useState({
    startYear: "",
    endYear: "",
    className: "",
    subject: "",
    level: "",
    coTeachers: "",
    syncWithGoogle: false,
  });

  const [open, setOpen] = useState(false);
  const [alertState, setAlertState] = useState<{
    show: boolean;
    type: "success" | "error" | null;
    message: string;
  }>({ show: false, type: null, message: "" });

  const validateForm = (): boolean => {
    const requiredFields: Record<string, string> = {
      startYear: "Start Year",
      endYear: "End Year",
      className: "Class Name",
      subject: "Subject",
      level: "Level",
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]) {
        setAlertState({
          show: true,
          type: "error",
          message: `${label} is required`,
        });
        return false;
      }
    }

    if (parseInt(formData.endYear) < parseInt(formData.startYear)) {
      setAlertState({
        show: true,
        type: "error",
        message: "End year cannot be before start year",
      });
      return false;
    }

    return true;
  };

  // Changed the type of value from any to string | boolean.
  const handleInputChange = (field: string, value: string | boolean): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setAlertState({ show: false, type: null, message: "" });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const classData = {
      name: formData.className,
      ay_start: parseInt(formData.startYear, 10),
      ay_end: parseInt(formData.endYear, 10),
      subject: formData.subject,
      level: formData.level,
      is_active: true,
      created_by: user?.id, // Use user.id as a string.
      coteachers: formData.coTeachers
        ? formData.coTeachers.split(",").map((email) => email.trim())
        : [],
      school_id: user?.schools?.[0]?.id || "",
    };

    try {
      const createdClass = await createClass(classData).unwrap();

      dispatch(
        addClass({
          ...classData,
          id: createdClass.id,
          section: undefined,
          external_id: null,
          source: null,
          google_classroom_sync: formData.syncWithGoogle,
        })
      );

      setAlertState({
        show: true,
        type: "success",
        message: "Class created successfully!",
      });

      setTimeout(() => {
        setOpen(false);
        setFormData({
          startYear: "",
          endYear: "",
          className: "",
          subject: "",
          level: "",
          coTeachers: "",
          syncWithGoogle: false,
        });
        setAlertState({ show: false, type: null, message: "" });
      }, 1500);
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { message: string } })?.data?.message ||
        "Failed to create class. Please try again.";
      setAlertState({
        show: true,
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full justify-start border-primary-grey-200 bg-transparent text-primary-purple hover:border-primary-purple/30 hover:bg-gradient-to-r hover:from-primary-purple/5 hover:to-primary-blue/5 transition-colors"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-primary-purple to-primary-blue rounded-lg">
              <School className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-primary-black">
              Add a New Class
            </DialogTitle>
          </div>
        </DialogHeader>
        {alertState.show && (
          <Alert
            variant={alertState.type === "error" ? "destructive" : "default"}
            className={`mx-6 mt-4 ${
              alertState.type === "success"
                ? "bg-primary-success/20 text-primary-success border-primary-success"
                : ""
            }`}
          >
            {alertState.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-primary-success" />
            )}
            <AlertDescription>{alertState.message}</AlertDescription>
          </Alert>
        )}
        <div className="p-6 space-y-6">
          <Card className="p-4 border-primary-grey-200 hover:border-primary-purple/30 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-primary-purple" />
              <h3 className="font-medium text-primary-black">Academic Year</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["startYear", "endYear"].map((field, idx) => (
                <div key={field} className="space-y-2">
                  <Label className="text-sm text-primary-grey-300">
                    {idx === 0 ? "Start Year" : "End Year"}
                  </Label>
                  <Select
                    onValueChange={(value) => handleInputChange(field, value)}
                  >
                    <SelectTrigger className="bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 border-primary-grey-200 hover:border-primary-purple/30 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-primary-purple" />
              <h3 className="font-medium text-primary-black">Class Details</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-primary-grey-300">
                  Class Name
                </Label>
                <Input
                  placeholder="Enter class name"
                  className="bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("className", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { field: "subject", label: "Subject", options: subjects },
                  { field: "level", label: "Level", options: levels },
                ].map(({ field, label, options }) => (
                  <div key={field} className="space-y-2">
                    <Label className="text-sm text-primary-grey-300">
                      {label}
                    </Label>
                    <Select
                      onValueChange={(value) => handleInputChange(field, value)}
                    >
                      <SelectTrigger className="bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20">
                        <SelectValue
                          placeholder={`Select ${label.toLowerCase()}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4 border-primary-grey-200 hover:border-primary-purple/30 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-primary-purple" />
              <h3 className="font-medium text-primary-black">Co-teachers</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-primary-grey-300">
                Email Addresses (Optional)
              </Label>
              <Input
                placeholder="Enter co-teacher email addresses, separated by commas"
                className="bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("coTeachers", e.target.value)
                }
              />
            </div>
          </Card>

          <Card className="p-4 border-primary-grey-200 hover:border-primary-purple/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 rounded-lg">
                  <Glasses className="h-4 w-4 text-primary-purple" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-black">
                    Google Classroom
                  </h3>
                  <p className="text-sm text-primary-grey-300">
                    Sync with Google Classroom (optional)
                  </p>
                </div>
              </div>
              <Switch
                className="data-[state=checked]:bg-primary-success"
                onCheckedChange={(value: boolean) =>
                  handleInputChange("syncWithGoogle", value)
                }
              />
            </div>
          </Card>
        </div>

        <DialogFooter className="flex gap-3 p-6 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 border-t border-primary-grey-200">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none border-primary-grey-200 hover:border-primary-purple/30 bg-white"
            onClick={() => {
              setOpen(false);
              setAlertState({ show: false, type: null, message: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 sm:flex-none bg-primary-purple hover:bg-primary-purple/90"
          >
            {isLoading ? "Creating..." : "Create Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
