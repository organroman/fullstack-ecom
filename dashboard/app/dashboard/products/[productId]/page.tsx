import { fetchProductById } from "@/features/products/api/products";
import ProductCard from "@/features/products/components/ProductCard";

const ProductDetailsPage = async ({
  params: { productId },
}: {
  params: { productId: string };
}) => {
  const product = await fetchProductById(Number(productId));

  return <ProductCard product={product} isShowDescription />;
};

export default ProductDetailsPage;
