import ProductDetailsPage from "./productIdClient";

async function ProductIdPage({
  params: { productId },
}: {
  params: { productId: string };
}) {
  return <ProductDetailsPage id={productId} />;
}

export default ProductIdPage;
