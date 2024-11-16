import { useParams } from "next/navigation";

export const useProductId = () => {
  const params = useParams();

  return params.productId as string;
};
