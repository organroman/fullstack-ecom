import { getDataFromLS } from "@/lib/utils";
import ProductsClient from "./productsClient";
import { redirect } from "next/navigation";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const searchParamsRes = await searchParams;
  const storedView = getDataFromLS("products-view") || "grid";

  const view = searchParamsRes.view;

  if (!view) {
    const params = new URLSearchParams(searchParamsRes);
    params.set("view", storedView);
    if (view !== "grid") {
      if (!searchParamsRes.page || !searchParamsRes.limit) {
        const params = new URLSearchParams(searchParamsRes);
        const page = searchParamsRes.page ?? "1";
        const limit = searchParamsRes.limit ?? "10";
        params.set("page", page);
        params.set("limit", limit);
      }
    }
    redirect(`/dashboard/products?${params.toString()}`);
  }
  return <ProductsClient />;
};

export default ProductsPage;
