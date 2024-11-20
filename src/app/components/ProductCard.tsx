import React from "react";
import { Product } from "../context/types";
import Image from "next/image";
import Link from "next/link";
import Add from "./Add";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const currentPrice = product.price;

  // Handle discounts
  const activeDiscounts = product.Discounts?.filter(discount => discount.active);
  const bestDiscount = activeDiscounts?.reduce((max, discount) => 
    discount.percentage > max.percentage ? discount : max, activeDiscounts[0]);

  const discountPercentage = bestDiscount?.percentage || null;
  const discountedPrice = bestDiscount
    ? (currentPrice * (1 - bestDiscount.percentage / 100)).toFixed(2)
    : currentPrice.toFixed(2);

  // Handle promotions
  const activePromotions = product.Promotions?.filter(promotion => {
    const now = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    return now >= start && now <= end;
  });
  
  const bestPromotion = activePromotions?.[0]; // Assuming one active promotion per product
  const promotionInstallments = bestPromotion?.installments || 0;

  const finalPrice = bestDiscount ? discountedPrice : currentPrice.toFixed(2);
  const monthlyInstallment = promotionInstallments > 0 
    ? (parseFloat(finalPrice) / promotionInstallments).toFixed(2)
    : null;

  return (
  <Link href={'/products/' + product.id} className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[30%]" key={product.id}>
      <div className="relative w-full h-80 group">
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-sm font-bold py-1 px-2 rounded z-20">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Imagen primaria (visible por defecto) */}
        <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0">
          <Image
            src={product.Images[0] ? `${API_URL}${product.Images[0].url}` : '/logo-verde-manzana.svg'}
            alt={product.name}
            layout="fill"
            sizes="25vw"
            className="object-cover rounded-md"
            unoptimized
          />
        </div>

        {/* Imagen secundaria (visible al hacer hover) */}
        <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
          <Image
            src={product.Images[1] ? `${API_URL}${product.Images[1].url}` : '/logo-verde-manzana.svg'}
            alt={product.name}
            layout="fill"
            sizes="25vw"
            className="object-cover rounded-md"
            unoptimized
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium">{product.name}</span>
        <div className="flex items-center space-x-2">
          {discountPercentage && (
            <span className="text-gray-500 line-through text-sm">${currentPrice.toFixed(2)}</span>
          )}
          <span className="font-semibold text-lg">${finalPrice}</span>
        </div>
      </div>
      
      {promotionInstallments > 0 && (
        <div className="text-center text-blue-600 font-semibold text-sm">
          {promotionInstallments}x de ${monthlyInstallment} sin interés
        </div>
            )}
      {/* Botón de redirección */}
      <Link href={'/products/' + product.id}>
        <button         className="2-36 text-sm rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200">
          Seleccionar opciones
        </button>
      </Link>
    </Link>
  );
};

export default ProductCard;
