import React from "react";
import { Product } from "../context/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const finalPrice = product.finalPrice.toFixed(2);

  const activePromotions = product.Promotions?.filter((promotion) => {
    const now = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    return now >= start && now <= end;
  });

  const bestPromotion = activePromotions?.[0];
  const promotionInstallments = bestPromotion?.installments || 0;

  const monthlyInstallment =
    promotionInstallments > 0
      ? (parseFloat(finalPrice) / promotionInstallments).toFixed(2)
      : null;

  return (
    <div className="w-full flex flex-col h-[480px] sm:w-[45%] lg:w-[30%] shadow-sm rounded-md p-4">
  <Link href={`/products/${product.id}`} className="relative w-full h-80 group">
    {/* Primary Image */}
    <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0">
      <Image
        src={
          product.Images[0]
            ? `${API_URL}${product.Images[0].url}`
            : "/logo-verde-manzana.svg"
        }
        alt={product.name}
        layout="fill"
        sizes="25vw"
        className="object-cover rounded-md"
        unoptimized
      />
    </div>

    {/* Secondary Image */}
    <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
      <Image
        src={
          product.Images[1]
            ? `${API_URL}${product.Images[1].url}`
            : "/logo-verde-manzana.svg"
        }
        alt={product.name}
        layout="fill"
        sizes="25vw"
        className="object-cover rounded-md"
        unoptimized
      />
    </div>
  </Link>

  {/* Product Details */}
  <div className="flex-grow mt-4">
    <div className="flex justify-between items-center">
      <span className="font-medium">{product.name}</span>
      <div className="flex items-center space-x-2">
        {product.Discounts && product.Discounts.length > 0 && (
          <span className="text-gray-500 line-through text-sm">
            ${product.price.toFixed(2)}
          </span>
        )}
        <span className="font-semibold text-lg">${finalPrice}</span>
      </div>
    </div>

    {promotionInstallments > 0 && (
      <div className="text-center text-blue-600 font-semibold text-sm mt-2">
        {promotionInstallments}x de ${monthlyInstallment} sin interés
      </div>
    )}
  </div>

  {/* Button Aligned */}
  <div className="mt-auto pt-4 flex justify-center">
    <Link href={`/products/${product.id}`}>
      <button
        className="w-56 text-sm rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200"
      >
        Seleccionar opciones
      </button>
    </Link>
  </div>
</div>


  );
};

export default ProductCard;