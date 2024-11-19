"use client";

import { useQuery } from "@tanstack/react-query";

import LoadingPage from "@/app/loading";
import ProductCard from "@/features/products/ProductCard";
import { Product } from "@/types/types";
import { listProducts } from "@/features/products/api/products";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const ProductsClient = () => {
  const {
    data: products,
    isPending,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await listProducts(),
  });

  if (isPending) {
    return <LoadingPage />;
  }

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 items-center gap-4">
      <Link href="/dashboard/products/create" className="h-full w-full">
        <Card className="p-5 rounded-lg flex-1 relative h-full flex items-center justify-center">
          <PlusIcon className="size-7" />
        </Card>
      </Link>
      {products?.map((product: Product) => (
        <ProductCard key={product.id} product={product} isShowDescription={false}/>
      ))}
    </div>
  );
};

export default ProductsClient;
