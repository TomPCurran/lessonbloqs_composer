import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useSmartApi } from "./useSmartApi";
import { useApi } from "./useApi";
import { useOnboardingApi } from "./useOnboardingApi";

export interface UserData {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profile?: {
    schoolId?: string;
    schoolName?: string;
    role?: string;
    subjects?: string[];
    gradeLevels?: string[];
    numYearsTeaching?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UseUserVerificationReturn {
  userExists: boolean | null; // null = loading, true = exists, false = doesn't exist
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserVerification = (): UseUserVerificationReturn => {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const smartApi = useSmartApi();
  const regularApi = useApi();
  const onboardingApi = useOnboardingApi();

  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkUserExists = useCallback(async () => {
    // First, ensure Clerk user is loaded and signed in
    if (!clerkLoaded) {
      console.log("🔍 User verification: Clerk not loaded yet");
      return;
    }

    if (!isSignedIn || !clerkUser?.id) {
      console.log("🔍 User verification: No Clerk user signed in");
      setUserExists(false);
      setUserData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(
        "🔍 Checking if user exists in database for Clerk ID:",
        clerkUser.id
      );

      const hasCompletedOnboarding =
        clerkUser.publicMetadata?.onboardingComplete === true;
      console.log(
        "📊 User onboarding status:",
        hasCompletedOnboarding ? "completed" : "not completed"
      );

      // First, try the smart API (automatically chooses the right one)
      console.log("📡 Trying smart API: users/me");

      try {
        const response = await smartApi.get<UserData>("users/me");

        // Check if response has the expected user data structure
        if (
          response &&
          typeof response === "object" &&
          "id" in response &&
          "clerkId" in response
        ) {
          setUserExists(true);
          setUserData(response);
          return; // Success with smart API
        }
      } catch (smartApiError: unknown) {
        const apiError = smartApiError as {
          statusCode?: number;
          message?: string;
        };
        // If it's 404, user doesn't exist
        if (apiError.statusCode === 404) {
          console.log(
            "✅ 404 from smart API - User does not exist in database"
          );
          setUserExists(false);
          setUserData(null);
          return;
        } else if (apiError.statusCode && apiError.statusCode >= 500) {
          console.error("❌ Server error from smart API:", apiError);
          setError(apiError.message || "Server error while checking user");
          setUserExists(null);
          return;
        }
      }

      // Fallback: Try both APIs explicitly (in case Clerk metadata is out of sync)
      if (hasCompletedOnboarding) {
        // User should exist, try regular API first, then onboarding
        console.log(
          "📡 Fallback: Trying regular API first (user marked as completed)"
        );

        try {
          const response = await regularApi.get<UserData>("users/me");

          setUserExists(true);
          setUserData(response);
          return;
        } catch (regularApiError) {
          console.log(
            "⚠️ Regular API fallback failed:",
            regularApiError,
            "trying onboarding API"
          );

          try {
            const response = await onboardingApi.get<UserData>("users/me");
            setUserExists(true);
            setUserData(response);
            return;
          } catch (onboardingApiError) {
            const apiError = onboardingApiError as {
              statusCode?: number;
              message?: string;
            };
            if (apiError.statusCode === 401 || apiError.statusCode === 404) {
              console.log(
                "✅ User does not exist in database (confirmed by both APIs)"
              );
              setUserExists(false);
              setUserData(null);
            } else {
              console.error("❌ Both APIs failed with errors:", apiError);
              setError("Unable to verify user status");
              setUserExists(null);
            }
          }
        }
      } else {
        // User is new, try onboarding API first, then regular
        console.log(
          "📡 Fallback: Trying onboarding API first (user not marked as completed)"
        );

        try {
          const response = await onboardingApi.get<UserData>("users/me");

          setUserExists(true);
          setUserData(response);
          return;
        } catch (onboardingApiError) {
          const apiError = onboardingApiError as {
            statusCode?: number;
            message?: string;
          };
          if (apiError.statusCode === 401 || apiError.statusCode === 404) {
            console.log(
              "✅ User does not exist in database (expected for new users)"
            );
            setUserExists(false);
            setUserData(null);
          } else {
            console.error("❌ Onboarding API failed:", apiError);
            setError("Unable to verify user status");
            setUserExists(null);
          }
        }
      }
    } catch (unexpectedError: unknown) {
      console.error(
        "❌ Unexpected error during user verification:",
        unexpectedError
      );
      setError("Unexpected error while checking user");
      setUserExists(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    smartApi,
    regularApi,
    onboardingApi,
    clerkLoaded,
    isSignedIn,
    clerkUser?.id,
    clerkUser?.publicMetadata?.onboardingComplete,
  ]);

  const refetch = useCallback(async () => {
    await checkUserExists();
  }, [checkUserExists]);

  // Check user existence when Clerk is ready
  useEffect(() => {
    if (clerkLoaded) {
      if (isSignedIn && clerkUser?.id) {
        checkUserExists();
      } else {
        // User is not signed in
        setUserExists(false);
        setUserData(null);
        setIsLoading(false);
      }
    }
  }, [clerkLoaded, isSignedIn, clerkUser?.id, checkUserExists]);

  return {
    userExists,
    userData,
    isLoading,
    error,
    refetch,
  };
};
