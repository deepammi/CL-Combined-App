export const revalidate = 0; 

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import React from "react";
import AiResearchPage from "./AiResearch";

interface UserDetails {
  roleId: RoleId;
}

enum RoleId {
  Admin = 1,
  Viewer = 2,
}

export default async function page() {
  const session = cookies().get("session");
  const payload = session && jwtDecode<UserDetails>(session.value);
  console.log("[AI researcher page session validation happened]", payload);
  // Check if the user is an admin
  if (payload?.roleId !== RoleId.Admin) {
    return (
      <div className="mt-24 flex items-center justify-center gap-4 h-auto">
        <div className="h-[100vh - 64px]">
          <h1 className="text-bold">No Access</h1>
          <p>You do not have the necessary permissions to view this page.</p>
        </div>
      </div>
    );
  }
  return <AiResearchPage />;
}
