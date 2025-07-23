"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import LessonbloqsLogoAnimated from "./AnimatedLogo";
const UserProfile = () => {
  // Potentially need to get user from State not from Clerk
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LessonbloqsLogoAnimated />
      </div>
    );
  }

  console.log("[UserProfile] user", user);
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
