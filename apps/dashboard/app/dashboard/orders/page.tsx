import { redirect } from "next/navigation";
import OrdersClient from "./ordersClient";

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const searchParamsRes = await searchParams;
  const page = searchParamsRes.page ?? "1";
  const limit = searchParamsRes.limit ?? "10";

  if (!searchParamsRes.page || !searchParamsRes.limit) {
    const params = new URLSearchParams(searchParamsRes);
    params.set("page", page);
    params.set("limit", limit);

    redirect(`/dashboard/orders?${params.toString()}`);
  }
  return <OrdersClient />;
};

export default OrdersPage;
