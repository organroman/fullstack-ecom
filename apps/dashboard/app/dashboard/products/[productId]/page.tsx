
import ProductDetailsPage from "./productIdClient";


function ProductIdPage({
  params: { productId },
}: {
  params: { productId: string };
}) {
  return <ProductDetailsPage id={productId} />;
}

export default ProductIdPage;
