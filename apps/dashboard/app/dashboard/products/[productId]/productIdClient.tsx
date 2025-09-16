"use client";

import { ProductImage, View } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";

import ErrorPage from "@/app/error";
import Header from "@/components/Header";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { useToken } from "@/components/providers/token-provider";

import ProductFormModal from "@/features/products/components/ProductFormModal";
import ProductActionsMenu from "@/features/products/components/ProductActionsMenu";

import { useDialog } from "@/hooks/use-modal";
import LoadingPage from "@/app/loading";

import { useCreateProduct } from "@/api/products/useCreateProduct";
import { useProductById } from "@/api/products/useProductById";

import { cn } from "@/lib/utils";

const ProductDetailsPage = ({ id }: { id: string }) => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const token = useToken();
  const {
    data: product,
    isLoading,
    error,
  } = useProductById({
    productId: Number(id),
    token,
  });

  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();
  const [api, setApi] = useState<CarouselApi>();
  const [currentIdx, setCurrentIdx] = useState(0);

  const view = (searchParams.get("view") || "table") as View;

  const { createProductMutation } = useCreateProduct({
    view,
    closeDialog,
    queryClient,
    token,
  });

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentIdx(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentIdx(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoading) {
    return <LoadingPage />;
  }
  if (error || !product) {
    return <ErrorPage error={error?.message || "Something went wrong"} />;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Product details"
        createItemVariant={{
          variant: "modal",
          dialogButtonLabel: "Create product",
          dialogOpen: dialogOpen,
          dialogHandleOpen: setDialogOpen,
          dialogContent: (
            <ProductFormModal productMutation={createProductMutation} />
          ),
        }}
        backBtn
      />
      <Card className="p-5 rounded-lg flex-1 relative hover:border-blue-400 hover:shadow-lg transition flex flex-row">
        <div className="flex flex-col items-center gap-4 spacing-y-4">
          <div className="w-[420px] h-[420px] object-fill flex justify-center bg-white rounded-md">
            <Image
              src={product.images[currentIdx]?.image_link}
              width={420}
              height={420}
              alt={product.name}
              className="h-[420px] w-auto"
            />
          </div>

          <Carousel
            className="w-full max-w-xs"
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
          >
            <CarouselContent>
              {product.images.map((image: ProductImage, index: number) => (
                <CarouselItem key={image.id} className={cn(`basis-1/3`)}>
                  <div
                    className={cn(
                      "bg-white rounded-md p-6 h-[90px] w-[90px] flex items-center justify-center object-fill",
                      currentIdx === index && "border-2 border-blue-500"
                    )}
                  >
                    <Image
                      src={image.image_link}
                      width={240}
                      height={280}
                      className="h-[80px] w-[80px] rounded-md object-fit"
                      alt={`${product.name} image`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <CardContent className="flex flex-col gap-4">
          <CardTitle>{product.name}</CardTitle>

          <Separator />
          <CardDescription>{product.description}</CardDescription>
          <CardDescription className="font-bold text-xl text-primary">
            ${product.price}
          </CardDescription>
        </CardContent>
        <div className="absolute top-4 right-4">
          <ProductActionsMenu product={product} />
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;
