import ProductsClient from "./productsClient";
import { redirect } from "next/navigation";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const searchParamsRes = await searchParams;

  const view = searchParamsRes.view;
  const params = new URLSearchParams(searchParamsRes);

  if (!view) {
    params.set("view", "grid");
    redirect(`/dashboard/products?${params.toString()}`);
  }

  if (view !== "grid") {
    if (!searchParamsRes.page || !searchParamsRes.limit) {
      const params = new URLSearchParams(searchParamsRes);
      const page = searchParamsRes.page ?? "1";
      const limit = searchParamsRes.limit ?? "10";
      params.set("page", page);
      params.set("limit", limit);
      redirect(`/dashboard/products?${params.toString()}`);
    }
  }
  return <ProductsClient />;
};

export default ProductsPage;
