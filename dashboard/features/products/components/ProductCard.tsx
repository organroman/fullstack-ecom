"use client";

import { ProductType } from "@/types/types";

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
  product: ProductType;
  isShowDescription: boolean;
}

const ProductCard = ({ product, isShowDescription }: ProductCardProps) => {
  return (
    <Card className="p-5 rounded-lg flex-1 relative hover:border-blue-400 hover:shadow-lg transition flex flex-col justify-center">
      <Carousel className="w-full max-w-xs relative" >
        <CarouselContent>
          {product.images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="bg-white rounded-md w-[280px]">
                <Image
                  src={image.image_link}
                  width={240}
                  height={280}
                  className="mb-6 h-[280px] rounded-md w-auto object-fit"
                  alt={`${product.name} image`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2" />
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
