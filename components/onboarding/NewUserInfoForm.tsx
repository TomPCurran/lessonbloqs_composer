"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  User,
  GraduationCap,
  Users,
  Building2,
  School,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormStore, ONBOARDING_FORM_ID } from "@/lib/stores";
import type { FormState } from "@/lib/stores";

// Types for the form data
interface UserInfoFormData {
  // Basic Info (all roles)
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthday: string;
  yearsInEducation: number;

  // Role-specific info
  role:
    | "teacher"
    | "paraprofessional"
    | "aide"
    | "school_admin"
    | "district_admin"
    | "other";

  // Teacher-specific fields
  gradeLevels?: string[];
  subjects?: string[];
  yearsTeaching?: number;
  certifications?: string[];
  specializations?: string[];

  // Administrator-specific fields
  title?: string;
  department?: string;
  responsibilities?: string;
  schoolCount?: number;
  districtSize?: string;
}

interface NewUserInfoFormProps {
  onBack?: () => void;
  onSubmit?: (data: UserInfoFormData) => void;
  className?: string;
}

// Constants
const ROLES = [
  {
    value: "teacher",
    label: "Teacher",
    icon: GraduationCap,
    description: "Classroom teacher",
  },
  {
    value: "paraprofessional",
    label: "Paraprofessional",
    icon: Users,
    description: "Teaching assistant or aide",
  },
  {
    value: "aide",
    label: "Aide",
    icon: Users,
    description: "Classroom or special education aide",
  },
  {
    value: "school_admin",
    label: "School Administrator",
    icon: Building2,
    description: "Principal, vice principal, etc.",
  },
  {
    value: "district_admin",
    label: "District Administrator",
    icon: School,
    description: "District-level administrator",
  },
  {
    value: "other",
    label: "Other",
    icon: User,
    description: "Other education professional",
  },
];

const GRADE_LEVELS = [
  "Pre-K",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
];

const SUBJECTS = [
  "English/Language Arts",
  "Mathematics",
  "Science",
  "Social Studies",
  "History",
  "Art",
  "Music",
  "Physical Education",
  "Health",
  "Computer Science",
  "Foreign Language",
  "Special Education",
  "ESL/ELL",
  "Career & Technical Education",
  "Library/Media",
  "Counseling",
  "Other",
];

const DISTRICT_SIZES = [
  "Small (Under 1,000 students)",
  "Medium (1,000 - 5,000 students)",
  "Large (5,000 - 20,000 students)",
  "Very Large (Over 20,000 students)",
];

export default function NewUserInfoForm({
  onBack,
  onSubmit,
  className,
}: NewUserInfoFormProps) {
  const { user } = useUser();
  const updateGenericForm = useFormStore((s: FormState) => s.updateGenericForm);
  const userInfoData = useFormStore(
    (s: FormState) => s.genericForms[ONBOARDING_FORM_ID]?.values?.userInfo
  );

  // Hydrate local form state from Zustand on mount (if exists), or use Clerk user data
  const [formData, setFormData] = useState<UserInfoFormData>(() => {
    if (userInfoData) {
      try {
        return JSON.parse(userInfoData as string);
      } catch {
        // fallback to Clerk user data
      }
    }

    // Use Clerk user data as fallback/default
    return {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phone: "",
      birthday: "",
      yearsInEducation: 0,
      role: "teacher",
      gradeLevels: [],
      subjects: [],
      yearsTeaching: 0,
      certifications: [],
      specializations: [],
      title: "",
      department: "",
      responsibilities: "",
      schoolCount: 0,
      districtSize: "",
    };
  });

  // Update form data when Clerk user data becomes available
  useEffect(() => {
    if (user && !userInfoData) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.primaryEmailAddress?.emailAddress || prev.email,
      }));
    }
  }, [user, userInfoData]);

  // On every formData change, update Zustand
  useEffect(() => {
    updateGenericForm(ONBOARDING_FORM_ID, "userInfo", JSON.stringify(formData));
  }, [formData, updateGenericForm]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserInfoFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper functions
  const isTeacherRole = (role: string) =>
    ["teacher", "paraprofessional", "aide"].includes(role);
  const isAdminRole = (role: string) =>
    ["school_admin", "district_admin"].includes(role);

  const handleInputChange = (
    field: keyof UserInfoFormData,
    value: string | number | string[] | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayChange = (
    field: keyof UserInfoFormData,
    value: string,
    action: "add" | "remove"
  ) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray =
      action === "add"
        ? [...currentArray, value]
        : currentArray.filter((item) => item !== value);

    handleInputChange(field, newArray);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserInfoFormData, string>> = {};

    console.log("[DEBUG] Validating form data:", formData);

    // Basic validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      console.log("[DEBUG] First name validation failed");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      console.log("[DEBUG] Last name validation failed");
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      console.log("[DEBUG] Email validation failed");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      console.log("[DEBUG] Email format validation failed");
    }
    if (!formData.birthday) {
      newErrors.birthday = "Birthday is required";
      console.log("[DEBUG] Birthday validation failed");
    }
    if (formData.yearsInEducation < 0) {
      newErrors.yearsInEducation = "Years in education must be 0 or greater";
      console.log("[DEBUG] Years in education validation failed");
    }

    // Role-specific validation
    if (isTeacherRole(formData.role)) {
      if (!formData.gradeLevels?.length) {
        newErrors.gradeLevels = "Please select at least one grade level";
        console.log("[DEBUG] Grade levels validation failed");
      }
      if (!formData.subjects?.length) {
        newErrors.subjects = "Please select at least one subject";
        console.log("[DEBUG] Subjects validation failed");
      }
      if ((formData.yearsTeaching || 0) < 0) {
        newErrors.yearsTeaching = "Years teaching must be 0 or greater";
        console.log("[DEBUG] Years teaching validation failed");
      }
    }

    if (isAdminRole(formData.role)) {
      if (!formData.title?.trim()) {
        newErrors.title = "Title is required";
        console.log("[DEBUG] Title validation failed");
      }
      if (!formData.department?.trim()) {
        newErrors.department = "Department is required";
        console.log("[DEBUG] Department validation failed");
      }
    }

    console.log("[DEBUG] Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("[DEBUG] Form submission attempted");
    console.log("[DEBUG] Form data:", formData);

    if (!validateForm()) {
      console.log("[DEBUG] Form validation failed");
      console.log("[DEBUG] Validation errors:", errors);
      return;
    }

    console.log("[DEBUG] Form validation passed, calling onSubmit");
    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
      console.log("[DEBUG] onSubmit completed successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-display-small font-bold text-foreground mb-2">
            Tell us about yourself
          </h1>
          <p className="text-body-large text-muted-foreground">
            Help us personalize your experience by sharing your role and
            background
          </p>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Your Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ROLES.map((role) => {
                  const IconComponent = role.icon;
                  const isSelected = formData.role === role.value;

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleInputChange("role", role.value)}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                        "hover:border-primary/50 hover:bg-primary-subtle/20",
                        isSelected
                          ? "border-primary bg-primary-subtle text-primary"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{role.label}</span>
                      </div>
                      <p className="text-body-small text-muted-foreground">
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-label-large">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter your first name"
                    className="google-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-label-large">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter your last name"
                    className="google-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-label-large">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className="google-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-label-large">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="google-input"
                    error={errors.phone}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthday" className="text-label-large">
                    Birthday *
                  </Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) =>
                      handleInputChange("birthday", e.target.value)
                    }
                    className="google-input"
                    error={errors.birthday}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="yearsInEducation"
                    className="text-label-large"
                  >
                    Years in Education *
                  </Label>
                  <Input
                    id="yearsInEducation"
                    type="number"
                    value={formData.yearsInEducation}
                    onChange={(e) =>
                      handleInputChange(
                        "yearsInEducation",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    className="google-input"
                    min="0"
                    error={errors.yearsInEducation}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teacher-Specific Information */}
        {isTeacherRole(formData.role) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Teaching Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Grade Levels */}
                  <div className="space-y-3">
                    <Label className="text-label-large">
                      Grade Levels You Teach *
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {GRADE_LEVELS.map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => {
                            const isSelected =
                              formData.gradeLevels?.includes(grade);
                            handleArrayChange(
                              "gradeLevels",
                              grade,
                              isSelected ? "remove" : "add"
                            );
                          }}
                          className={cn(
                            "px-3 py-2 rounded-lg border text-body-small transition-colors",
                            formData.gradeLevels?.includes(grade)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                    {errors.gradeLevels && (
                      <p className="text-body-small text-destructive">
                        {errors.gradeLevels}
                      </p>
                    )}
                  </div>

                  {/* Subjects */}
                  <div className="space-y-3">
                    <Label className="text-label-large">
                      Subjects You Teach *
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {SUBJECTS.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => {
                            const isSelected =
                              formData.subjects?.includes(subject);
                            handleArrayChange(
                              "subjects",
                              subject,
                              isSelected ? "remove" : "add"
                            );
                          }}
                          className={cn(
                            "px-3 py-2 rounded-lg border text-body-small transition-colors text-left",
                            formData.subjects?.includes(subject)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                    {errors.subjects && (
                      <p className="text-body-small text-destructive">
                        {errors.subjects}
                      </p>
                    )}
                  </div>

                  {/* Years Teaching */}
                  <div className="space-y-2">
                    <Label htmlFor="yearsTeaching" className="text-label-large">
                      Years Teaching
                    </Label>
                    <Input
                      id="yearsTeaching"
                      type="number"
                      value={formData.yearsTeaching}
                      onChange={(e) =>
                        handleInputChange(
                          "yearsTeaching",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="0"
                      className="google-input"
                      min="0"
                      error={errors.yearsTeaching}
                    />
                  </div>

                  {/* Certifications */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="certifications"
                      className="text-label-large"
                    >
                      Certifications
                    </Label>
                    <Input
                      id="certifications"
                      value={formData.certifications?.join(", ") || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "certifications",
                          e.target.value.split(", ").filter(Boolean)
                        )
                      }
                      placeholder="e.g., Teaching License, ESL Certification, Special Education"
                      className="google-input"
                    />
                  </div>

                  {/* Specializations */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="specializations"
                      className="text-label-large"
                    >
                      Specializations
                    </Label>
                    <Input
                      id="specializations"
                      value={formData.specializations?.join(", ") || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "specializations",
                          e.target.value.split(", ").filter(Boolean)
                        )
                      }
                      placeholder="e.g., Gifted Education, Reading Specialist, Technology Integration"
                      className="google-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Administrator-Specific Information */}
        {isAdminRole(formData.role) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Administrative Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-label-large">
                      Job Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="e.g., Principal, Director of Curriculum"
                      className="google-input"
                      error={errors.title}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-label-large">
                      Department *
                    </Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      placeholder="e.g., Administration, Curriculum, Special Education"
                      className="google-input"
                      error={errors.department}
                    />
                  </div>

                  {formData.role === "district_admin" && (
                    <>
                      <div className="space-y-2">
                        <Label
                          htmlFor="schoolCount"
                          className="text-label-large"
                        >
                          Number of Schools
                        </Label>
                        <Input
                          id="schoolCount"
                          type="number"
                          value={formData.schoolCount}
                          onChange={(e) =>
                            handleInputChange(
                              "schoolCount",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="e.g., 25"
                          className="google-input"
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="districtSize"
                          className="text-label-large"
                        >
                          District Size
                        </Label>
                        <Select
                          value={formData.districtSize}
                          onValueChange={(value) =>
                            handleInputChange("districtSize", value)
                          }
                        >
                          <SelectTrigger className="google-input">
                            <SelectValue placeholder="Select district size" />
                          </SelectTrigger>
                          <SelectContent>
                            {DISTRICT_SIZES.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="responsibilities"
                      className="text-label-large"
                    >
                      Key Responsibilities
                    </Label>
                    <textarea
                      id="responsibilities"
                      value={formData.responsibilities}
                      onChange={(e) =>
                        handleInputChange("responsibilities", e.target.value)
                      }
                      placeholder="Describe your main responsibilities and areas of focus..."
                      className="google-input min-h-[100px] resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-between items-center pt-6"
        >
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                Creating Account...
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
