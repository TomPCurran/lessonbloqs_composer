/*
 * Smart API Hook
 * Path: lib/hooks/api/useSmartApi.ts
 *
 * Automatically chooses between regular API and onboarding API based on user state.
 * Uses onboarding API for new users, switches to regular API after onboarding completion.
 */
import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useApi } from "./useApi";
import { useOnboardingApi } from "./useOnboardingApi";

interface UseSmartApiOptions {
  forceOnboarding?: boolean; // Force use of onboarding API even if user exists
  forceRegular?: boolean; // Force use of regular API even during onboarding
}

export const useSmartApi = (options: UseSmartApiOptions = {}) => {
  const { user } = useUser();
  const regularApi = useApi();
  const onboardingApi = useOnboardingApi();

  return useMemo(() => {
    // If explicitly forced to use a specific API
    if (options.forceOnboarding) {
      return onboardingApi;
    }
    if (options.forceRegular) {
      return regularApi;
    }

    // Check if user has completed onboarding based on Clerk metadata
    const hasCompletedOnboarding =
      user?.publicMetadata?.onboardingComplete === true;

    if (hasCompletedOnboarding) {
      // User has completed onboarding, use regular API
      return regularApi;
    } else {
      // User is still in onboarding or new, use onboarding API
      return onboardingApi;
    }
  }, [
    user?.publicMetadata?.onboardingComplete,
    regularApi,
    onboardingApi,
    options,
  ]);
};
