import { fetchProductById } from "@/api/products";
import ProductCard from "@/components/products/ProductCard";

const ProductDetailsPage = async ({
  params: { productId },
}: {
  params: { productId: string };
}) => {
  const product = await fetchProductById(Number(productId));

  return <ProductCard product={product} />;
};

export default ProductDetailsPage;
