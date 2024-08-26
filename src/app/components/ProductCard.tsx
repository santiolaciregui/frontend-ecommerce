import React from "react";
import { Product } from "../context/types";
import Image from "next/image";
import Link from "next/link";
import Add from "./Add";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const currentPrice = product.price;

  const activeDiscounts = product.Discounts?.filter(discount => discount.active);
  const bestDiscount = activeDiscounts?.reduce((max, discount) => 
    discount.percentage > max.percentage ? discount : max, activeDiscounts[0]);

  const finalPrice = bestDiscount
    ? (currentPrice * (1 - bestDiscount.percentage / 100)).toFixed(2)
    : currentPrice.toFixed(2);

  const discountPercentage = bestDiscount?.percentage || null;
  const monthlyInstallment = (parseFloat(finalPrice) / 12).toFixed(2);

  const API_URL = 'https://backend-ecommerce-aecr.onrender.com';  // Update this URL if your backend is hosted elsewhere


  return (
    <Link href={'/products/' + product.id} className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]" key={product.id}>
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
      
      <div className="text-center text-orange-600 font-semibold text-sm">
        12 cuotas sin interés de ${monthlyInstallment}
      </div>

      <Add 
        product={product} 
        selectedOptions={[]}
        stockNumber={product.stock || 0}
        quantity={1}
      />
    </Link>
  );
};

export default ProductCard;
