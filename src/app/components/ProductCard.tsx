import React from "react";
import { Product } from "../context/types";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import DOMPurify from 'isomorphic-dompurify';
import Add from "./Add";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  // Calculate discount percentage if original price is available
  const originalPrice = product.price + 50;
  const currentPrice = product.price;
  const discountPercentage = originalPrice ? Math.round((1 - currentPrice / originalPrice) * 100) : null;

  // Calculate monthly installment (example: 12 months)
  const monthlyInstallment = currentPrice ? (currentPrice / 12).toFixed(2) : null;

  return (
    <Link href={'/products/' + product.id} className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]" key={product.id}>
      <div className="relative w-full h-80">
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-sm font-bold py-1 px-2 rounded z-20">
            {discountPercentage}% OFF
          </div>
        )}
        <Image
          src={product.url || 'logo-verde-manzana.svg'}
          alt=""
          layout="fill"
          sizes="25vw"
          className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
        />
        {product.media?.items && <Image
          src={product.media?.items[1]?.image?.url || 'logo-verde-manzana.svg'}
          alt=""
          layout="fill"
          sizes="25vw"
          className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
        />}
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">{product.name}</span>
        <div className="flex items-center space-x-2">
          {originalPrice && (
            <span className="text-gray-500 line-through text-sm">${originalPrice}</span>
          )}
          <span className="font-semibold text-lg">${currentPrice}</span>
        </div>
      </div>
      
      {monthlyInstallment && (
        <div className="text-center text-orange-600 font-semibold text-sm">
          12 cuotas sin interés de ${monthlyInstallment}
        </div>
      )}
      <Add 
        product={product} 
        variantId='000000-0000-00000-00000-000000000' 
        stockNumber={product.stock?.quantity || 0}
        quantity={1}
      />
    </Link>
  );
};

export default ProductCard;
