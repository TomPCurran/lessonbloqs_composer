export interface OnboardingFormData {
  // Step 1 - Basic Information
  firstName: string;
  lastName: string;
  role: "teacher" | "administrator" | "student" | "other" | "";

  // Step 2 - Application Details
  applicationName: string;
  applicationType: string;
  teamSize: "1-5" | "6-20" | "21-50" | "50+" | "";

  // Step 3 - Preferences
  notifications: boolean;
  theme: "light" | "dark" | "system";
  language: "en" | "es" | "fr";
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

export interface OnboardingResponse {
  message?: string;
  error?: string;
  userData?: any;
}

// Extend Clerk's user metadata type
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      role?: string;
      applicationName?: string;
      applicationType?: string;
      teamSize?: string;
      notifications?: boolean;
      theme?: string;
      language?: string;
      onboardingCompletedAt?: string;
    };
  }
}

export interface OnboardingFormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  role: string;

  // Step 2
  schoolName: string;
  schoolType: string;
  district: string;

  // Step 3
  subjects: string[];
  gradeLevels: string[];
  yearsTeaching: string;
  notifications: boolean;
}
