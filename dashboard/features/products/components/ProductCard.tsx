"use client";

import { ProductType } from "@/types/types";

import Image from "next/image";

import { Card } from "@/components/ui/card";

import ActionsMenu from "./ProductActionsMenu";

interface ProductCardProps {
  product: ProductType;
  isShowDescription: boolean;
}

const ProductCard = ({ product, isShowDescription }: ProductCardProps) => {
  return (
    <Card className="p-5 rounded-lg flex-1 relative hover:border-blue-400 hover:shadow-lg transition">
      <Image
        src={product.image}
        width={240}
        height={240}
        className="mb-6 h-[240px] rounded-md w-auto object-fit"
        alt={`${product.name} image`}
      />

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
      <h3 className="mb-4">${product.price}</h3>
      <div className=" flex justify-between w-full"></div>
    </Card>
  );
};

export default ProductCard;
