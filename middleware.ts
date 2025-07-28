import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/register(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Allow public routes for everyone (including unauthenticated users)
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a private route
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Check if user has completed onboarding
  const hasCompletedOnboarding = sessionClaims?.metadata?.onboardingComplete;

  // If user is authenticated but hasn't completed onboarding
  if (!hasCompletedOnboarding && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // If user has completed onboarding but is on onboarding route, redirect to profile
  if (hasCompletedOnboarding && isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // Allow access to all other routes for authenticated users
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
