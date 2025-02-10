import React from "react";
import { Product } from "../context/types";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "../utils/getImageURL";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Use the product's final price (assumed to be a number)
  const finalPrice = product.finalPrice;
  const formattedFinalPrice = finalPrice.toFixed(2);

  // According to your checkout:
  // - Cash: base price (no multiplier)
  // - Transfer: 10% extra (as seen in your order summary note)
  // - Installments: no interest (sin interés) unless a specific installment option with interest is selected at checkout
  const transferPrice = finalPrice * 1.10;
  const formattedTransferPrice = transferPrice.toFixed(2);

  const threeInstallment = finalPrice * 1.30 / 3;
  const formattedThreeInstallment = threeInstallment.toFixed(2);

  const sixInstallment = finalPrice * 1.45 / 6;
  const formattedSixInstallment = sixInstallment.toFixed(2);

  return (
    <div className="w-full flex flex-col h-[480px] sm:w-[45%] lg:w-[30%] shadow-sm rounded-md p-4">
      <Link href={`/products/${product.id}`} className="relative w-full h-80 group">
        {/* Primary Image */}
        <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0">
          <Image
            src={
              product.Images[0]
                ? getImageUrl(product.Images[0].url)
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
            <span className="font-semibold text-lg">${formattedFinalPrice}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="mt-2 space-y-1">
          <div className="text-sm">
            <span>Transferencia: </span>
            <span className="font-semibold">${formattedTransferPrice}</span>
          </div>
          <div className="text-sm">
            <span>3 cuotas de: </span>
            <span className="font-semibold">${formattedThreeInstallment}</span>
          </div>
          <div className="text-sm">
            <span>6 cuotas de: </span>
            <span className="font-semibold">${formattedSixInstallment}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
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
