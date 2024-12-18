"use client";

import { ProductImage, ProductType, View } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import Header from "@/components/Header";

import ProductFormModal from "@/features/products/components/ProductFormModal";

import { useDialog } from "@/hooks/use-modal";
import LoadingPage from "@/app/loading";

import { useCreateProduct } from "@/api/products/queries/useCreateProduct";
import { useProductById } from "@/api/products/queries/useProductById";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import ProductActionsMenu from "@/features/products/components/ProductActionsMenu";

const ProductDetailsPage = ({
  params: { productId },
}: {
  params: { productId: string };
}) => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [api, setApi] = useState<CarouselApi>();
  const [currentIdx, setCurrentIdx] = useState(0);

  const { data, isLoading, error } = useProductById(Number(productId));

  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();

  const { product } = data || ({} as ProductType);

  const view = (searchParams.get("view") || "table") as View;

  const { createProductMutation } = useCreateProduct({
    view,
    closeDialog,
    queryClient,
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

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Product details"
        dialogButtonLabel="Create product"
        dialogOpen={dialogOpen}
        dialogHandleOpen={setDialogOpen}
        dialogContent={
          <ProductFormModal productMutation={createProductMutation} />
        }
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
