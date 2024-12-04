import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoleAndUserFromToken } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import UserIdClient from "./userIdClient";

const UserIdPage = ({ params }: { params: { userId: string } }) => {
  const token = cookies().get("auth-token")?.value;

  if (!token) {
    return redirect("/login");
  }
  const { role, userId: currentUserId } = getRoleAndUserFromToken(token);
  const isAllowedToEdit = role === "ADMIN" || currentUserId === params.userId;

  return (
    <UserIdClient
      userId={params.userId}
      isAllowedToEdit={isAllowedToEdit}
      role={role}
    />
  );
};

export default UserIdPage;
