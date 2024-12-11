import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRoleAndUserFromToken } from "@/lib/utils";

import UserIdClient from "./userIdClient";

const UserIdPage = ({ params }: { params: { userId: string } }) => {
  const token = cookies().get("auth-token")?.value;

  if (!token) {
    return redirect("/login");
  }
  const { role, userId: currentUserId } = getRoleAndUserFromToken(token);
  const isAllowedToEdit = role === "ADMIN" || currentUserId === params.userId;

  return (
    <div className="flex flex-col gap-4 h-full">
      <UserIdClient
        userId={params.userId}
        isAllowedToEdit={isAllowedToEdit}
        role={role}
      />
    </div>
  );
};

export default UserIdPage;
