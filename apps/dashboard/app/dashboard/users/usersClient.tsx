"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";

import { useToken } from "@/components/providers/token-provider";
import { usersColumns } from "@/features/users/components/UsersColumns";
import UsersFormModal from "@/features/users/components/UsersFormModal";
import UserRolesSelector from "@/components/UserRolesSelector";
import ErrorPage from "@/app/error";

import { useDialog } from "@/hooks/use-modal";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";

import { usePaginatedUsers } from "@/api-service/users/useGetPaginatedUsers";
import { useCreateUser } from "@/api-service/users/useCreateUser";

const UsersClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const { dialogOpen, setDialogOpen, closeDialog } = useDialog(false);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const token = useToken();

  const {
    searchPhrase,
    setSearchPhrase,
    handleSearch,
    handleLimitChange,
    handlePageChange,
    handleRoleChange,
  } = useUpdateQueryParams({
    page,
    limit,
    search,
    role,
    router,
    searchParams,
  });

  const { data, isLoading, error } = usePaginatedUsers({
    page,
    limit,
    search,
    role,
    token,
  });
  const { users = [], totalPages, total } = data || {};

  const { createUserMutation } = useCreateUser({
    closeDialog,
    queryClient,
    token,
  });

  const handleFilterChange = (role: string) => {
    handleRoleChange(role);
  };

  if (error || !data || !totalPages || !total) {
    return <ErrorPage error={error?.message || "Something went wrong"} />;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        searchPhrase={searchPhrase}
        onSearch={handleSearch}
        setSearchPhrase={setSearchPhrase}
        title="Users"
        createItemVariant={{
          variant: "modal",
          dialogOpen: dialogOpen,
          dialogButtonLabel: "Create user",
          dialogHandleOpen: setDialogOpen,
          dialogContent: <UsersFormModal userMutation={createUserMutation} />,
        }}
        filterComponent={
          <UserRolesSelector
            role={role}
            onChange={handleFilterChange}
            isDisplaySelectItemAll
          />
        }
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
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default UsersClient;
