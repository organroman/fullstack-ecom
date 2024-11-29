"use client";

import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "lucide-react";

import useCart from "@/store/cartStore";
import { useFavorite } from "@/store/favoriteStore";
import { ProductType } from "@/types/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: ProductType;
  isShowDescription: boolean;
}

const ProductCard = ({ product, isShowDescription }: ProductCardProps) => {
  const addProduct = useCart((state) => state.addProduct);
  const deleteProduct = useCart((state) => state.addProduct);
  const toggleFavorites = useFavorite((state) => state.toggleProduct);
  const cartItems = useCart((state) => state.items);
  const favoriteItems = useFavorite((state) => state.items);

  const isInCart = cartItems.some((item) => item.product.id === product.id);
  const isInFavorite = favoriteItems.some(
    (item) => item.product.id === product.id
  );

  const addToCart = () => {
    addProduct(product);
  };

  const deleteFromCart = () => {
    deleteProduct(product);
  };

  return (
    <Card className="p-5 rounded-lg flex-1 relative hover:border-blue-400 hover:shadow-lg transition">
      <Link href={`/dashboard/products/${product.id}`}>
        <Image
          src={product.image}
          width={240}
          //   fill
          height={240}
          className="mb-6 h-[240px] rounded-md w-auto object-fit"
          alt={`${product.name} image`}
        />
      </Link>
      <p className="text-sm font-normal mb-2 text-typography-700">
        {product.name}
      </p>
      {isShowDescription && (
        <p className="text-sm font-normal mb-2 text-typography-700">
          {product.description}
        </p>
      )}
      <h3 className="mb-4">${product.price}</h3>
      <div className=" flex justify-between w-full">
        <Button
          onClick={isInCart ? deleteFromCart : addToCart}
          className="min-w-[100px]"
        >
          {isInCart ? "Remove" : "Buy"}
        </Button>
        <Button variant="ghost" onClick={() => toggleFavorites(product)}>
          <HeartIcon size={48} />
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
