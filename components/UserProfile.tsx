"use client";
import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import LessonbloqsLogoAnimated from "./AnimatedLogo";

// Type for onboarding data
interface OnboardingData {
  // User Information
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  yearsInEducation?: number;
  role?: string;

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

  // Organization Information
  organizationName?: string;
  organizationType?: string;
  organizationAddress?: string;
  organizationCity?: string;
  organizationState?: string;
  organizationZipCode?: string;
  organizationPhone?: string;
  organizationWebsite?: string;
  organizationEmail?: string;
  organizationDescription?: string;
  organizationStudentCount?: number;
  organizationSchoolCount?: number;
  organizationFoundedYear?: number;
  organizationPrincipalName?: string;
  organizationSuperintendentName?: string;

  // Onboarding status
  onboardingComplete?: boolean;
  onboardingCompletedAt?: string;
}

const UserProfile = () => {
  console.log("[UserProfile] Component is rendering");

  useEffect(() => {
    console.log("[UserProfile] Component mounted");
  }, []);

  // Potentially need to get user from State not from Clerk
  const { user, isLoaded, isSignedIn } = useUser();

  console.log("[UserProfile] useUser hook result:", {
    user,
    isLoaded,
    isSignedIn,
  });

  if (!isLoaded) {
    console.log("[UserProfile] Not loaded yet, showing loading state");
    return (
      <div className="flex items-center justify-center h-screen">
        <LessonbloqsLogoAnimated />
      </div>
    );
  }

  if (!isSignedIn) {
    console.log("[UserProfile] User not signed in");
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Signed In</h1>
          <p>Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  console.log("[UserProfile] User is signed in and loaded:", user);

  // Extract onboarding data from publicMetadata with proper typing
  const onboardingData = (user?.publicMetadata || {}) as OnboardingData;

  // Debug logging to see exactly what's in publicMetadata
  console.log("[UserProfile] Raw publicMetadata:", user?.publicMetadata);
  console.log("[UserProfile] Parsed onboarding data:", onboardingData);
  console.log("[UserProfile] User's first/last name from Clerk:", {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.primaryEmailAddress?.emailAddress,
  });

  const {
    firstName,
    lastName,
    email,
    phone,
    birthday,
    yearsInEducation,
    role,
    gradeLevels,
    subjects,
    yearsTeaching,
    certifications,
    specializations,
    title,
    department,
    responsibilities,
    schoolCount,
    districtSize,
    organizationName,
    organizationType,
    organizationAddress,
    organizationCity,
    organizationState,
    organizationZipCode,
    organizationPhone,
    organizationWebsite,
    organizationEmail,
    organizationDescription,
    organizationStudentCount,
    organizationSchoolCount,
    organizationFoundedYear,
    organizationPrincipalName,
    organizationSuperintendentName,
    onboardingComplete,
    onboardingCompletedAt,
  } = onboardingData;

  // Use Clerk user data as fallback for basic info
  const displayFirstName = firstName || user?.firstName || "Not set";
  const displayLastName = lastName || user?.lastName || "";
  const displayEmail =
    email || user?.primaryEmailAddress?.emailAddress || "Not set";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="google-card mb-6">
          <div className="text-display-large font-semibold mb-2">
            Profile Banner Goes Here
          </div>
          {/* <ProfileBanner userProps={{ currentUser, isLoading, error }} /> */}
        </div>

        <div className="flex gap-6 mt-8">
          <div className="w-72 flex-shrink-0">
            {/* Profile Actions Goes Here */}
            <div className="google-card p-4 mb-6">
              Profile Actions Goes Here
              {/* <ProfileActions isAdmin={isAdmin} /> */}
            </div>
          </div>
          <div className="flex-1 space-y-6">
            {/* User Information */}
            <div className="google-card p-6">
              <h2 className="text-headline-large mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>
                    {displayFirstName} {displayLastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{displayEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{phone || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Birthday:</span>
                  <span>{birthday || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Years in Education:</span>
                  <span>{yearsInEducation || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Role:</span>
                  <span>{role || "Not set"}</span>
                </div>
              </div>
            </div>

            {/* Role-specific Information */}
            {role && ["teacher", "paraprofessional", "aide"].includes(role) && (
              <div className="google-card p-6">
                <h2 className="text-headline-large mb-4">
                  Teaching Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Grade Levels:</span>
                    <span>{gradeLevels?.join(", ") || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Subjects:</span>
                    <span>{subjects?.join(", ") || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Years Teaching:</span>
                    <span>{yearsTeaching || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Certifications:</span>
                    <span>{certifications?.join(", ") || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Specializations:</span>
                    <span>{specializations?.join(", ") || "Not set"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Administrator Information */}
            {role && ["school_admin", "district_admin"].includes(role) && (
              <div className="google-card p-6">
                <h2 className="text-headline-large mb-4">
                  Administrative Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Title:</span>
                    <span>{title || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Department:</span>
                    <span>{department || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Responsibilities:</span>
                    <span>{responsibilities || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">School Count:</span>
                    <span>{schoolCount || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">District Size:</span>
                    <span>{districtSize || "Not set"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Organization Information */}
            {organizationName && (
              <div className="google-card p-6">
                <h2 className="text-headline-large mb-4">
                  Organization Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Organization Name:</span>
                    <span>{organizationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>{organizationType || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Address:</span>
                    <span>
                      {organizationAddress}, {organizationCity},{" "}
                      {organizationState} {organizationZipCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span>{organizationPhone || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Website:</span>
                    <span>{organizationWebsite || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{organizationEmail || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Description:</span>
                    <span>{organizationDescription || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Student Count:</span>
                    <span>{organizationStudentCount || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">School Count:</span>
                    <span>{organizationSchoolCount || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Founded Year:</span>
                    <span>{organizationFoundedYear || "Not set"}</span>
                  </div>
                  {organizationPrincipalName && (
                    <div className="flex justify-between">
                      <span className="font-medium">Principal:</span>
                      <span>{organizationPrincipalName}</span>
                    </div>
                  )}
                  {organizationSuperintendentName && (
                    <div className="flex justify-between">
                      <span className="font-medium">Superintendent:</span>
                      <span>{organizationSuperintendentName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Onboarding Status */}
            <div className="google-card p-6">
              <h2 className="text-headline-large mb-4">Onboarding Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Onboarding Complete:</span>
                  <span>{onboardingComplete ? "Yes" : "No"}</span>
                </div>
                {onboardingCompletedAt && (
                  <div className="flex justify-between">
                    <span className="font-medium">Completed At:</span>
                    <span>
                      {new Date(onboardingCompletedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Debug Information */}
            <div className="google-card p-6">
              <h2 className="text-headline-large mb-4">Debug Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Raw publicMetadata:</span>
                  <span className="text-xs max-w-md truncate">
                    {JSON.stringify(user?.publicMetadata, null, 2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">User ID:</span>
                  <span>{user?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Created At:</span>
                  <span>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Updated At:</span>
                  <span>
                    {user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="google-card p-6">
              <h2 className="text-headline-large mb-4">Your Classrooms</h2>
              Classrooms Goes Here
              {/* <ClassroomList classrooms={classes} /> */}
            </div>

            <div className="google-card p-6">
              <h2 className="text-headline-large mb-4">Team Management</h2>
              Team Management Goes here
              {/* <TeamManagement /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
