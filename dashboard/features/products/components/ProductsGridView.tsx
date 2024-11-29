import { ProductType } from "@/types/types";

import React, { useCallback, useEffect, useRef } from "react";
import { Loader } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { listProducts } from "../api/products";

import ProductCard from "./ProductCard";
import LoadingPage from "@/app/loading";

const ProductsGridView = () => {

  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["products-infinite"],
      queryFn: async ({ pageParam }) => await listProducts(pageParam, 10),
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage;
        return page < totalPages ? page + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
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
    <div className=" overflow-y-auto">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 items-center gap-4 overflow-y-auto ">
        {allProducts?.map((product: ProductType) => (
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

      <div ref={observerRef} className="h-2" />
    </div>
  );
};

export default ProductsGridView;
