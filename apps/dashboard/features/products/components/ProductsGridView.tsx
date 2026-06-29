"use client";
import { Product } from "@/types/types";

import { useCallback, useEffect, useRef } from "react";
import { Loader } from "lucide-react";

import LoadingPage from "@/app/loading";
import ProductCard from "./ProductCard";
import { useInfiniteProducts } from "@/api-service/products/useInfiniteProducts";

import { useSearchParams } from "next/navigation";

const ProductsGridView = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({ search });

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: scrollContainerRef.current,
      // rootMargin: "0px",
      rootMargin: "0px 0px 200px 0px",
      threshold: 1.0,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-y-auto max-h-[calc(100vh-100px)]"
    >
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 items-center gap-4">
        {allProducts?.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            isShowDescription={false}
          />
        ))}
      </div>
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      )}

      <div ref={observerRef} className="h-4" />
    </div>
  );
};

export default ProductsGridView;
