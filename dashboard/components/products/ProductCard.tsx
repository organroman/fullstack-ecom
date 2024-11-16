"use client";

import useCart from "@/store/cartStore";
import { useFavorite } from "@/store/favoriteStore";
import { Product } from "@/types/types";
import { Card } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
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
    <Card className="p-5 rounded-lg flex-1 relative">
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
