import { fetchProductById } from "@/features/products/api/products";
import ProductCard from "@/features/products/components/ProductCard";
import ProductsHeader from "@/features/products/components/ProductsHeader";

const ProductDetailsPage = async ({
  params: { productId },
}: {
  params: { productId: string };
}) => {
  const product = await fetchProductById(Number(productId));

  return (
    <div className="flex flex-col gap-4 h-full">
      <ProductsHeader title="Product details" />
      <ProductCard product={product} isShowDescription />
    </div>
  );
};

export default ProductDetailsPage;
