"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import OrganizationSearchBar from "./OrganizationSearchBar";
import NewOrganizationForm from "./NewOrganizationForm";
import NewUserInfoForm from "./NewUserInfoForm";
import { completeOnboarding } from "@/lib/actions/onboarding.actions";
import { useFormStore, ONBOARDING_FORM_ID } from "@/lib/stores";
import type { FormState } from "@/lib/stores";

// Types for organization data (matching the search bar)
interface Organization {
  id: string;
  name: string;
  type: "school" | "district";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  studentCount?: number;
  schoolCount?: number;
  description?: string;
}

// Types for new organization form data
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

type OnboardingStep = "search" | "new-organization" | "user-info";

const MultiStepOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("search");
  const [searchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Get Clerk user and router
  const { user } = useUser();
  const router = useRouter();

  // Get Zustand store actions and values
  const updateGenericForm = useFormStore((s: FormState) => s.updateGenericForm);
  const organizationData = useFormStore(
    (s: FormState) => s.genericForms[ONBOARDING_FORM_ID]?.values?.organization
  );
  const userInfoData = useFormStore(
    (s: FormState) => s.genericForms[ONBOARDING_FORM_ID]?.values?.userInfo
  );

  const handleOrganizationSelect = (organization: Organization) => {
    console.log("[DEBUG] User selected existing organization:", organization);
    setCurrentStep("user-info");
  };

  const handleAddCustomOrganization = () => {
    setCurrentStep("new-organization");
  };

  const handleBackToSearch = () => {
    setCurrentStep("search");
  };

  const handleNewOrganizationSubmit = (formData: NewOrganizationFormData) => {
    console.log("[DEBUG] User created new organization:", formData);
    setCurrentStep("user-info");
  };

  const handleBackToOrganization = () => {
    setCurrentStep("search");
  };

  const handleUserInfoSubmit = async (userData: unknown) => {
    console.log("[DEBUG] User info submitted:", userData);

    console.log("[DEBUG] Organization info from Zustand:", organizationData);
    console.log("[DEBUG] User info from Zustand:", userInfoData);

    // Log complete onboarding data
    console.log("[DEBUG] === COMPLETE ONBOARDING DATA ===");
    console.log(
      "[DEBUG] Organization:",
      organizationData
        ? JSON.parse(organizationData as string)
        : "No organization data"
    );
    console.log(
      "[DEBUG] User Info:",
      userInfoData ? JSON.parse(userInfoData as string) : "No user info data"
    );
    console.log("[DEBUG] =================================");

    try {
      // Create FormData for Clerk submission
      const formData = new FormData();

      // Add organization data
      if (organizationData) {
        try {
          const org = JSON.parse(organizationData as string);
          formData.append("organizationName", org.name || "");
          formData.append("organizationType", org.type || "");
          formData.append("organizationAddress", org.address || "");
          formData.append("organizationCity", org.city || "");
          formData.append("organizationState", org.state || "");
          formData.append("organizationZipCode", org.zipCode || "");
          formData.append("organizationPhone", org.phone || "");
          formData.append("organizationWebsite", org.website || "");
          formData.append("organizationEmail", org.email || "");
          formData.append("organizationDescription", org.description || "");
          formData.append(
            "organizationStudentCount",
            org.studentCount?.toString() || ""
          );
          formData.append(
            "organizationSchoolCount",
            org.schoolCount?.toString() || ""
          );
          formData.append(
            "organizationFoundedYear",
            org.foundedYear?.toString() || ""
          );
          formData.append("organizationPrincipalName", org.principalName || "");
          formData.append(
            "organizationSuperintendentName",
            org.superintendentName || ""
          );
        } catch (error) {
          console.error("[DEBUG] Error parsing organization data:", error);
        }
      }

      // Add user info data
      if (userInfoData) {
        try {
          const userInfo = JSON.parse(userInfoData as string);
          formData.append("firstName", userInfo.firstName || "");
          formData.append("lastName", userInfo.lastName || "");
          formData.append("email", userInfo.email || "");
          formData.append("phone", userInfo.phone || "");
          formData.append("birthday", userInfo.birthday || "");
          formData.append(
            "yearsInEducation",
            userInfo.yearsInEducation?.toString() || ""
          );
          formData.append("role", userInfo.role || "");
          formData.append(
            "gradeLevels",
            JSON.stringify(userInfo.gradeLevels || [])
          );
          formData.append("subjects", JSON.stringify(userInfo.subjects || []));
          formData.append(
            "yearsTeaching",
            userInfo.yearsTeaching?.toString() || ""
          );
          formData.append(
            "certifications",
            JSON.stringify(userInfo.certifications || [])
          );
          formData.append(
            "specializations",
            JSON.stringify(userInfo.specializations || [])
          );
          formData.append("title", userInfo.title || "");
          formData.append("department", userInfo.department || "");
          formData.append("responsibilities", userInfo.responsibilities || "");
          formData.append(
            "schoolCount",
            userInfo.schoolCount?.toString() || ""
          );
          formData.append("districtSize", userInfo.districtSize || "");
        } catch (error) {
          console.error("[DEBUG] Error parsing user info data:", error);
        }
      }

      // Submit to Clerk
      const result = await completeOnboarding(formData);

      if (result?.message) {
        console.log(
          "[DEBUG] Onboarding completed successfully:",
          result.message
        );

        // Reload the user's data from the Clerk API (as per Clerk documentation)
        await user?.reload();

        // Clear onboarding form data from Zustand
        updateGenericForm(ONBOARDING_FORM_ID, "organization", "");
        updateGenericForm(ONBOARDING_FORM_ID, "userInfo", "");

        // Redirect to profile page
        router.push("/profile");
      }

      if (result?.error) {
        console.error("[DEBUG] Onboarding error:", result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error("[DEBUG] Error during onboarding submission:", error);
      setError(
        "There was an error completing your onboarding. Please try again."
      );
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait" initial={false}>
          {currentStep === "search" && (
            <motion.div
              key="search"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  // Swipe left to go to new organization form
                  handleAddCustomOrganization();
                }
              }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <motion.h1
                  className="text-display-large font-normal text-foreground mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Find Your Organization
                </motion.h1>
                <motion.p
                  className="text-body-large text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Search for your school or district to get started
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <OrganizationSearchBar
                  onOrganizationSelect={handleOrganizationSelect}
                  onAddCustomOrganization={handleAddCustomOrganization}
                  placeholder="Search for your school or district..."
                  className="w-full max-w-2xl mx-auto"
                />
              </motion.div>

              {/* Swipe hint */}
              <motion.div
                className="text-center mt-8 text-body-small text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p>
                  💡 Can&apos;t find your organization? Swipe left or click
                  &ldquo;Add custom organization&rdquo;
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentStep === "new-organization" && (
            <motion.div
              key="new-organization"
              custom={-1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe > swipeConfidenceThreshold) {
                  // Swipe right to go back to search
                  handleBackToSearch();
                }
              }}
              className="w-full"
            >
              <NewOrganizationForm
                initialData={{
                  name: searchTerm,
                  type: "school",
                }}
                onBack={handleBackToSearch}
                onSubmit={handleNewOrganizationSubmit}
                className="w-full"
              />

              {/* Swipe hint */}
              <motion.div
                className="text-center mt-8 text-body-small text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p>💡 Swipe right to go back to search</p>
              </motion.div>
            </motion.div>
          )}

          {currentStep === "user-info" && (
            <motion.div
              key="user-info"
              custom={-1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe > swipeConfidenceThreshold) {
                  // Swipe right to go back to organization selection
                  handleBackToOrganization();
                }
              }}
              className="w-full"
            >
              {currentStep === "user-info" &&
                (() => {
                  console.log(
                    `[DEBUG] User is now filling out info for organization:`,
                    organizationData
                  );
                  return null;
                })()}

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <p className="text-destructive text-body-medium">{error}</p>
                </motion.div>
              )}

              <NewUserInfoForm
                onBack={handleBackToOrganization}
                onSubmit={handleUserInfoSubmit}
                className="w-full"
              />

              {/* Swipe hint */}
              <motion.div
                className="text-center mt-8 text-body-small text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p>💡 Swipe right to go back to organization selection</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step indicator */}
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border">
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                currentStep === "search" ? "bg-primary" : "bg-muted"
              )}
            />
            <span className="text-body-small text-muted-foreground">
              Organization
            </span>
            <div className="w-4 h-px bg-border" />
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                currentStep === "user-info" ? "bg-primary" : "bg-muted"
              )}
            />
            <span className="text-body-small text-muted-foreground">
              Profile
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper function for conditional classes
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

export default MultiStepOnboardingForm;
