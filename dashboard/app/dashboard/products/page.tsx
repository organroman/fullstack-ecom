import { listProducts } from "@/api/products";
import ProductCard from "@/components/products/ProductCard";

import { Product } from "@/types/types";

const ProductsPage = async () => {
  const products = await listProducts();

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 items-center gap-4">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsPage;
