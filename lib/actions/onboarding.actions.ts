"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

// Type for user update data
interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  publicMetadata: {
    onboardingComplete: boolean;
    onboardingCompletedAt: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthday?: string;
    yearsInEducation?: number;
    role?: string;
    gradeLevels?: string[];
    subjects?: string[];
    yearsTeaching?: number;
    certifications?: string[];
    specializations?: string[];
    title?: string;
    department?: string;
    responsibilities?: string;
    schoolCount?: number;
    districtSize?: string;
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
  };
}

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No Logged In User" };
  }

  console.log("[DEBUG] Starting onboarding completion for user:", userId);

  try {
    // Extract all form data from the onboarding form
    const onboardingData = {
      // User Information
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      birthday: formData.get("birthday") as string,
      yearsInEducation:
        parseInt(formData.get("yearsInEducation") as string) || 0,
      role: formData.get("role") as string,

      // Teacher-specific fields
      gradeLevels: JSON.parse((formData.get("gradeLevels") as string) || "[]"),
      subjects: JSON.parse((formData.get("subjects") as string) || "[]"),
      yearsTeaching: parseInt(formData.get("yearsTeaching") as string) || 0,
      certifications: JSON.parse(
        (formData.get("certifications") as string) || "[]"
      ),
      specializations: JSON.parse(
        (formData.get("specializations") as string) || "[]"
      ),

      // Administrator-specific fields
      title: formData.get("title") as string,
      department: formData.get("department") as string,
      responsibilities: formData.get("responsibilities") as string,
      schoolCount: parseInt(formData.get("schoolCount") as string) || 0,
      districtSize: formData.get("districtSize") as string,

      // Organization Information
      organizationName: formData.get("organizationName") as string,
      organizationType: formData.get("organizationType") as string,
      organizationAddress: formData.get("organizationAddress") as string,
      organizationCity: formData.get("organizationCity") as string,
      organizationState: formData.get("organizationState") as string,
      organizationZipCode: formData.get("organizationZipCode") as string,
      organizationPhone: formData.get("organizationPhone") as string,
      organizationWebsite: formData.get("organizationWebsite") as string,
      organizationEmail: formData.get("organizationEmail") as string,
      organizationDescription: formData.get(
        "organizationDescription"
      ) as string,
      organizationStudentCount:
        parseInt(formData.get("organizationStudentCount") as string) || 0,
      organizationSchoolCount:
        parseInt(formData.get("organizationSchoolCount") as string) || 0,
      organizationFoundedYear:
        parseInt(formData.get("organizationFoundedYear") as string) || 0,
      organizationPrincipalName: formData.get(
        "organizationPrincipalName"
      ) as string,
      organizationSuperintendentName: formData.get(
        "organizationSuperintendentName"
      ) as string,
    };

    console.log("[DEBUG] Extracted onboarding data:", onboardingData);

    // Update user with first/last name if provided
    const userUpdateData: UserUpdateData = {
      publicMetadata: {
        onboardingComplete: true,
        onboardingCompletedAt: new Date().toISOString(),

        // User Information
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        email: onboardingData.email,
        phone: onboardingData.phone,
        birthday: onboardingData.birthday,
        yearsInEducation: onboardingData.yearsInEducation,
        role: onboardingData.role,

        // Teacher-specific fields
        gradeLevels: onboardingData.gradeLevels,
        subjects: onboardingData.subjects,
        yearsTeaching: onboardingData.yearsTeaching,
        certifications: onboardingData.certifications,
        specializations: onboardingData.specializations,

        // Administrator-specific fields
        title: onboardingData.title,
        department: onboardingData.department,
        responsibilities: onboardingData.responsibilities,
        schoolCount: onboardingData.schoolCount,
        districtSize: onboardingData.districtSize,

        // Organization Information
        organizationName: onboardingData.organizationName,
        organizationType: onboardingData.organizationType,
        organizationAddress: onboardingData.organizationAddress,
        organizationCity: onboardingData.organizationCity,
        organizationState: onboardingData.organizationState,
        organizationZipCode: onboardingData.organizationZipCode,
        organizationPhone: onboardingData.organizationPhone,
        organizationWebsite: onboardingData.organizationWebsite,
        organizationEmail: onboardingData.organizationEmail,
        organizationDescription: onboardingData.organizationDescription,
        organizationStudentCount: onboardingData.organizationStudentCount,
        organizationSchoolCount: onboardingData.organizationSchoolCount,
        organizationFoundedYear: onboardingData.organizationFoundedYear,
        organizationPrincipalName: onboardingData.organizationPrincipalName,
        organizationSuperintendentName:
          onboardingData.organizationSuperintendentName,
      },
    };

    // Only update name fields if they're provided and different from current
    if (onboardingData.firstName) {
      userUpdateData.firstName = onboardingData.firstName;
    }
    if (onboardingData.lastName) {
      userUpdateData.lastName = onboardingData.lastName;
    }

    console.log("[DEBUG] About to update user with data:", userUpdateData);

    // Fix: Get the clerk client instance first, then update user
    const client = await clerkClient();
    const res = await client.users.updateUser(userId, userUpdateData);

    console.log("[DEBUG] User update successful:", res.publicMetadata);

    return {
      message: "Onboarding completed successfully",
      userData: res.publicMetadata,
    };
  } catch (err) {
    console.error("[DEBUG] Onboarding error:", err);
    return {
      error: "There was an error completing your onboarding. Please try again.",
    };
  }
};
