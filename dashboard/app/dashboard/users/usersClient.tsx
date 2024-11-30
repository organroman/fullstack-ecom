"use client";

import LoadingPage from "@/app/loading";
import { Button } from "@/components/ui/button";
import { listUsers } from "@/features/users/api/users";
import { columns } from "@/features/users/components/columns";
import { DataTable } from "@/components/DataTable";
import { IUser } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const UsersClient = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await listUsers(),
  });

  const router = useRouter();

  if (isLoading) {
    return <LoadingPage />;
  }

  console.log(data);
  return (
    <div className="container mx-auto py-5 flex flex-col gap-4">
      {/* <Link href="/dashboard/users/create" className="self-end"> */}
      <Button
        onClick={() => router.push("/dashboard/users/create")}
        className="self-end"
      >
        Create user
      </Button>
      {/* </Link> */}
      <DataTable columns={columns} data={data.users} 
    //   totalItems={data.total} 
      />
    </div>
  );
};

export default UsersClient;
