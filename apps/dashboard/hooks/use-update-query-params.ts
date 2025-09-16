import { View } from "@/types/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface UseUpdateQueryParamsProps {
  search?: string;
  searchParams: ReadonlyURLSearchParams;
  page?: number;
  limit?: number;
  router: AppRouterInstance;
  view?: View;
  role?: string;
  category?: string;
}

interface UseUpdateQueryParams {
  searchPhrase: string;
  setSearchPhrase: Dispatch<SetStateAction<string>>;
  handlePageChange: (newPage: number) => void;
  handleLimitChange: (newLimit: number) => void;
  handleStatusChange: (newStatus: string) => void;
  handleSearch: (newSearch: string) => void;
  handleView: () => void;
  handleRoleChange: (newRole: string) => void;
  handleCategoryChange: (newCategory: string) => void;
}

interface UpdateQueryParam {
  newPage?: number;
  newLimit?: number;
  newSearch?: string;
  newView?: View;
  newStatus?: string;
  newRole?: string;
  newCategory?: string;
}

export function useUpdateQueryParams({
  search = "",
  page,
  limit,
  searchParams,
  router,
  view,
  role,
  category,
}: UseUpdateQueryParamsProps): UseUpdateQueryParams {
  const [searchPhrase, setSearchPhrase] = useState<string>(search);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (page) {
      if (!searchParams.get("page")) params.set("page", page.toString());
    } else params.delete("page");

    if (limit) {
      if (!searchParams.get("limit")) params.set("limit", limit.toString());
    } else params.delete("limit");

    if (view) {
      if (!searchParams.get("view")) params.set("view", view.toString());
    }

    if (role) {
      if (!searchParams.get("role")) params.set("role", role.toString());
    } else params.delete("role");

    if (category) {
      if (!searchParams.get("categoryId"))
        params.set("categoryId", category.toString());
    } else params.delete("categoryId");

    if (params.toString() !== searchParams.toString()) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams.toString(), page, limit, view, router, search]);

  const updateQueryParams = ({
    newLimit,
    newPage,
    newRole,
    newSearch,
    newView,
    newStatus,
    newCategory,
  }: UpdateQueryParam) => {
    const params = new URLSearchParams(searchParams.toString());
    newPage ? params.set("page", newPage?.toString()) : params.delete("page");
    newLimit
      ? params.set("limit", newLimit?.toString())
      : params.delete("limit");

    newSearch
      ? params.set("search", newSearch?.toString())
      : params.delete("search");

    newView ? params.set("view", newView?.toString()) : params.delete("view");

    newStatus &&
      (newStatus === "All"
        ? params.delete("status")
        : params.set("status", newStatus.toString()));

    newRole &&
      (newRole === "All"
        ? params.delete("role")
        : params.set("role", newRole.toString()));

    newCategory &&
      (newCategory === "All"
        ? params.delete("categoryId")
        : params.set("categoryId", newCategory.toString()));

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = useCallback((newPage: number) => {
    updateQueryParams({ newPage });
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    updateQueryParams({ newLimit });
  }, []);

  const handleStatusChange = useCallback((newStatus: string) => {
    updateQueryParams({ newStatus });
  }, []);

  const handleSearch = useCallback((newSearch: string) => {
    updateQueryParams({ newSearch });
  }, []);

  const handleView = useCallback(() => {
    const newView = (view === "grid" ? "table" : "grid") as View;

    updateQueryParams({ newView });
    localStorage.setItem("products-view", JSON.stringify(newView));
  }, []);

  const handleRoleChange = useCallback((newRole: string) => {
    updateQueryParams({ newRole });
  }, []);

  const handleCategoryChange = useCallback((newCategory: string) => {
    updateQueryParams({ newCategory });
  }, []);

  return {
    searchPhrase,
    setSearchPhrase,
    handlePageChange,
    handleLimitChange,
    handleStatusChange,
    handleSearch,
    handleView,
    handleRoleChange,
    handleCategoryChange,
  };
}
