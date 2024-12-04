"use client";

import LoadingPage from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import UserRolesSelector from "@/components/UserRolesSelector";
import { getUser } from "@/features/users/api/users";
import { IUser } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { PencilIcon } from "lucide-react";

interface UserIdClientProps {
  userId: string;
  isAllowedToEdit: boolean;
  role: string;
}

const UserIdClient = ({ userId, isAllowedToEdit, role }: UserIdClientProps) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<any, Error, IUser>({
    queryKey: ["user", userId],
    queryFn: async () => await getUser(userId),
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <p>Error of fetch user</p>;
  }

  console.log(user?.createdAt)

  return (
    <Card className="mx-auto max-w-[768px] sm:max-w[460px] border shadow-md dark:shadow-slate-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Profile</CardTitle>
        {isAllowedToEdit && (
          <Button variant="ghost" size="icon">
            <PencilIcon />
            <span className="sr-only">edit</span>
          </Button>
        )}
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="grid w-full items-center gap-4 mt-2">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name" className="text-xs">
              Name
            </Label>
            <Input id="name" value={user?.name} readOnly />
          </div>
          <Select>
            <UserRolesSelector role={role} isDisabled />
          </Select>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Email" className="text-xs">
              Email
            </Label>
            <Input id="Email" value={user?.email} readOnly />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Phone" className="text-xs">
              Phone
            </Label>
            <Input id="Phone" value={user?.phone} readOnly />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="address" className="text-xs">
              Address
            </Label>
            <Input id="address" value={user?.address} readOnly />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="createdAt" className="text-xs">
              Created At
            </Label>
            <Input
              id="createdAt"
              value={dayjs(user?.createdAt).format("DD.MM.YYYY hh:MM")}
              readOnly
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserIdClient;
