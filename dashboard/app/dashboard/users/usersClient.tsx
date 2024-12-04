"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import LoadingPage from "@/app/loading";

import { DataTable } from "@/components/DataTable";

import { listUsers } from "@/features/users/api/users";
import { usersColumns } from "@/features/users/components/UsersColumns";
import UsersHeader from "@/features/users/components/UsersHeader";

const UsersClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchPhrase, setSearchPhrase] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, limit, search, role],
    queryFn: async () => await listUsers(page, limit, search, role),
  });
  const { users = [], totalPages, total } = data || {};

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (!searchParams.get("page")) params.set("page", page.toString());
    if (!searchParams.get("limit")) params.set("limit", limit.toString());

    if (params.toString() !== searchParams.toString()) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, page, limit, router]);

  const updateQueryParams = (newPage?: number, newLimit?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    newPage ? params.set("page", newPage?.toString()) : params.delete("page");
    newLimit
      ? params.set("limit", newLimit?.toString())
      : params.delete("limit");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams(newPage, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    updateQueryParams(page, newLimit);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <UsersHeader
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
      />
      <div className="h-full border overflow-y-auto rounded-md">
        <DataTable
          columns={usersColumns}
          data={users}
          totalItems={total}
          totalPages={totalPages}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
          currentPage={page}
          currentLimit={limit}
        />
      </div>
    </div>
  );
};

export default UsersClient;
