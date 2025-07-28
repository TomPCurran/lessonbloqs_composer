"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Building2,
  Users,
  MapPin,
  Phone,
  Globe,
  Mail,
  FileText,
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
import {
  useFormStore,
  ONBOARDING_FORM_ID,
  getOnboardingFormValues,
} from "@/lib/stores";
import type { FormState } from "@/lib/stores";

// Types for the form data
interface NewOrganizationFormData {
  name: string;
  type: "school" | "district";
  schoolType?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  email: string;
  description: string;
  studentCount?: number;
  schoolCount?: number;
  foundedYear?: number;
  principalName?: string;
  superintendentName?: string;
}

interface NewOrganizationFormProps {
  initialData?: Partial<NewOrganizationFormData>;
  onBack?: () => void;
  onSubmit?: (data: NewOrganizationFormData) => void;
  className?: string;
}

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const SCHOOL_TYPES = [
  { value: "elementary", label: "Elementary School" },
  { value: "middle", label: "Middle School" },
  { value: "high", label: "High School" },
  { value: "k12", label: "K-12 School" },
  { value: "charter", label: "Charter School" },
  { value: "private", label: "Private School" },
  { value: "magnet", label: "Magnet School" },
  { value: "vocational", label: "Vocational School" },
  { value: "special", label: "Special Education School" },
  { value: "other", label: "Other" },
];

export default function NewOrganizationForm({
  initialData = {},
  onBack,
  onSubmit,
  className,
}: NewOrganizationFormProps) {
  const updateGenericForm = useFormStore((s: FormState) => s.updateGenericForm);
  const onboardingValues = useFormStore(getOnboardingFormValues);

  // Hydrate local form state from Zustand on mount (if exists)
  const [formData, setFormData] = useState<NewOrganizationFormData>(() => {
    if (onboardingValues.organization) {
      try {
        return JSON.parse(onboardingValues.organization);
      } catch {
        // fallback to initialData
      }
    }
    return {
      name: initialData.name || "",
      type: initialData.type || "school",
      address: initialData.address || "",
      city: initialData.city || "",
      state: initialData.state || "",
      zipCode: initialData.zipCode || "",
      phone: initialData.phone || "",
      website: initialData.website || "",
      email: initialData.email || "",
      description: initialData.description || "",
      studentCount: initialData.studentCount || undefined,
      schoolCount: initialData.schoolCount || undefined,
      foundedYear: initialData.foundedYear || undefined,
      principalName: initialData.principalName || "",
      superintendentName: initialData.superintendentName || "",
    };
  });

  // On every formData change, update Zustand
  useEffect(() => {
    updateGenericForm(
      ONBOARDING_FORM_ID,
      "organization",
      JSON.stringify(formData)
    );
  }, [formData, updateGenericForm]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof NewOrganizationFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof NewOrganizationFormData,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewOrganizationFormData, string>> =
      {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Website validation
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website =
        "Please enter a valid website URL (include http:// or https://)";
    }

    // Phone validation
    if (
      formData.phone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit?.(formData);
      console.log("Form submitted:", formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOrganizationIcon = () => {
    return formData.type === "district" ? (
      <Building2 className="h-6 w-6" />
    ) : (
      <Users className="h-6 w-6" />
    );
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="google-button-ghost"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        )}

        <div className="flex-1">
          <h1 className="text-display-medium font-normal text-foreground mb-2">
            Add New Organization
          </h1>
          <p className="text-body-medium text-muted-foreground">
            Help us add your organization to our database
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Organization Type Selection */}
        <Card className="google-card">
          <CardHeader>
            <CardTitle className="text-headline-medium text-foreground flex items-center gap-2">
              {getOrganizationIcon()}
              Organization Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-label-large">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "school" | "district") =>
                    handleInputChange("type", value)
                  }
                >
                  <SelectTrigger className="google-input">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>School</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="district">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>School District</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "school" && (
                <div className="space-y-2">
                  <Label htmlFor="schoolType" className="text-label-large">
                    School Type
                  </Label>
                  <Select
                    value={formData.schoolType || ""}
                    onValueChange={(value) =>
                      handleInputChange(
                        "schoolType" as keyof NewOrganizationFormData,
                        value
                      )
                    }
                  >
                    <SelectTrigger className="google-input">
                      <SelectValue placeholder="Select school type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHOOL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="google-card">
          <CardHeader>
            <CardTitle className="text-headline-medium text-foreground">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-label-large">
                Organization Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter organization name"
                className={cn(
                  "google-input",
                  errors.name && "border-destructive"
                )}
              />
              {errors.name && (
                <p className="text-body-small text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-label-large">
                Description
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description of the organization"
                className="google-input min-h-[100px] resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="foundedYear" className="text-label-large">
                  Founded Year
                </Label>
                <Input
                  id="foundedYear"
                  type="number"
                  value={formData.foundedYear || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "foundedYear",
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="e.g., 1995"
                  className="google-input"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCount" className="text-label-large">
                  {formData.type === "district"
                    ? "Total Students"
                    : "Number of Students"}
                </Label>
                <Input
                  id="studentCount"
                  type="number"
                  value={formData.studentCount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "studentCount",
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="e.g., 1500"
                  className="google-input"
                  min="1"
                />
              </div>
            </div>

            {formData.type === "district" && (
              <div className="space-y-2">
                <Label htmlFor="schoolCount" className="text-label-large">
                  Number of Schools
                </Label>
                <Input
                  id="schoolCount"
                  type="number"
                  value={formData.schoolCount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "schoolCount",
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="e.g., 25"
                  className="google-input"
                  min="1"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="google-card">
          <CardHeader>
            <CardTitle className="text-headline-medium text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-label-large flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className={cn(
                    "google-input",
                    errors.phone && "border-destructive"
                  )}
                />
                {errors.phone && (
                  <p className="text-body-small text-destructive">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-label-large flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@organization.edu"
                  className={cn(
                    "google-input",
                    errors.email && "border-destructive"
                  )}
                />
                {errors.email && (
                  <p className="text-body-small text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="text-label-large flex items-center gap-1"
              >
                <Globe className="h-3 w-3" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://www.organization.edu"
                className={cn(
                  "google-input",
                  errors.website && "border-destructive"
                )}
              />
              {errors.website && (
                <p className="text-body-small text-destructive">
                  {errors.website}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="google-card">
          <CardHeader>
            <CardTitle className="text-headline-medium text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-label-large">
                Street Address *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Education Street"
                className={cn(
                  "google-input",
                  errors.address && "border-destructive"
                )}
              />
              {errors.address && (
                <p className="text-body-small text-destructive">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-label-large">
                  City *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Springfield"
                  className={cn(
                    "google-input",
                    errors.city && "border-destructive"
                  )}
                />
                {errors.city && (
                  <p className="text-body-small text-destructive">
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-label-large">
                  State *
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleInputChange("state", value)}
                >
                  <SelectTrigger
                    className={cn(
                      "google-input",
                      errors.state && "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-body-small text-destructive">
                    {errors.state}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-label-large">
                  ZIP Code *
                </Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="12345"
                  className={cn(
                    "google-input",
                    errors.zipCode && "border-destructive"
                  )}
                />
                {errors.zipCode && (
                  <p className="text-body-small text-destructive">
                    {errors.zipCode}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leadership Information */}
        <Card className="google-card">
          <CardHeader>
            <CardTitle className="text-headline-medium text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Leadership Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.type === "school" && (
                <div className="space-y-2">
                  <Label htmlFor="principalName" className="text-label-large">
                    Principal Name
                  </Label>
                  <Input
                    id="principalName"
                    value={formData.principalName}
                    onChange={(e) =>
                      handleInputChange("principalName", e.target.value)
                    }
                    placeholder="Dr. Jane Smith"
                    className="google-input"
                  />
                </div>
              )}

              {formData.type === "district" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="superintendentName"
                    className="text-label-large"
                  >
                    Superintendent Name
                  </Label>
                  <Input
                    id="superintendentName"
                    value={formData.superintendentName}
                    onChange={(e) =>
                      handleInputChange("superintendentName", e.target.value)
                    }
                    placeholder="Dr. John Doe"
                    className="google-input"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-body-small text-muted-foreground">
            <p>* Required fields</p>
          </div>

          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="google-button-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              className="google-button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Adding Organization...
                </>
              ) : (
                "Add Organization"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
