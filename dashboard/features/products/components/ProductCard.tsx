"use client";

import { Product } from "@/types/types";

import Image from "next/image";

import { Card } from "@/components/ui/card";

import ActionsMenu from "./ProductActionsMenu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductCardProps {
  product: Product;
  isShowDescription: boolean;
}

const ProductCard = ({ product, isShowDescription }: ProductCardProps) => {
  return (
    <Card className="p-5 h-[380px] rounded-lg flex-1 relative hover:border-blue-400 hover:shadow-lg transition flex flex-col justify-center">
      <Carousel className="w-full max-w-xs relative">
        <CarouselContent>
          {product.images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="rounded-md h-[280px] aspect-square w-full flex justify-center ">
                <Image
                  src={image.image_link}
                  width={240}
                  height={280}
                  className="mb-6 h-[280px] aspect-square rounded-md object-contain bg-transparent"
                  alt={`${product.name} image`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2" />
      </Carousel>

      <div className="absolute top-2 right-2">
        <ActionsMenu product={product} />
      </div>
      <p className="text-md font-semibold mb-2 text-typography-700">
        {product.name}
      </p>
      {isShowDescription && (
        <p className="text-md font-normal mb-2 text-typography-700">
          {product.description}
        </p>
      )}
      <h3>${product.price}</h3>
    </Card>
  );
};

export default ProductCard;
