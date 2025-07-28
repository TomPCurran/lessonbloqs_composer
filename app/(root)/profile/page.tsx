import React from "react";
import UserProfile from "@/components/UserProfile";

const page = async () => {
  console.log("[Profile Page] Server component is rendering");

  return (
    <main>
      <UserProfile />
    </main>
  );
};

export default page;
