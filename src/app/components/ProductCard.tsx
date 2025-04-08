'use client';

import React from "react";
import { PaymentFormat, Product } from "../context/types";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "../utils/getImageURL";
import { PAYMENT_FORMATS_ES } from "../constants/checkoutConstants";

interface Props {
  product: Product;
  paymentFormats: PaymentFormat[];
}

const ProductCard = ({ product, paymentFormats }: Props) => {
  const finalPrice = product.finalPrice;
  const formattedFinalPrice = finalPrice.toFixed(2);

  // Buscar las configuraciones específicas
  const transferConfig = paymentFormats.find(
    (config) => config.paymentMethod === PAYMENT_FORMATS_ES.TRANSFER
  );
  const threeInstallmentsConfig = paymentFormats.find(
    (config) => {
      config.paymentMethod === PAYMENT_FORMATS_ES.CUOTAS_3}
  );
  const sixInstallmentsConfig = paymentFormats.find(
    (config) => config.paymentMethod === PAYMENT_FORMATS_ES.CUOTAS_6
  );

  // Si la configuración no existe, se usan valores por defecto
  const transferMultiplier = transferConfig
    ? 1 + Number(transferConfig.percentage)
    : 1.10;
  const threeInstallmentMultiplier = threeInstallmentsConfig
    ? 1 + Number(threeInstallmentsConfig.percentage)
    : 1.25;
  const sixInstallmentMultiplier = sixInstallmentsConfig
    ? 1 + Number(sixInstallmentsConfig.percentage)
    : 1.35;

  const transferPrice = finalPrice * transferMultiplier;
  const formattedTransferPrice = transferPrice.toFixed(2);

  const threeInstallment = (finalPrice * threeInstallmentMultiplier) / 3;
  const formattedThreeInstallment = threeInstallment.toFixed(2);

  const sixInstallment = (finalPrice * sixInstallmentMultiplier) / 6;
  const formattedSixInstallment = sixInstallment.toFixed(2);

  return (
    <div className="flex flex-col h-full shadow-sm rounded-md p-4 border border-gray-100 hover:shadow-md transition-shadow">
      {/* Fixed height image container */}
      <Link href={`/products/${product.id}`} className="block w-full h-80 md:h-96 mb-4 overflow-hidden rounded-md">
        <div className="relative w-full h-full">
          <Image
            src={
              product.Images[0]
                ? getImageUrl(product.Images[0].url)
                : "/logo-verde-manzana.svg"
            }
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain rounded-md"
            unoptimized
          />
        </div>
      </Link>

      {/* Fixed height details container */}
      <div className="flex-grow h-36">
        <div className="flex justify-between items-start">
          <span className="font-medium text-xs md:text-sm line-clamp-2 h-12">{product.name}</span>
          <div className="flex items-center space-x-2">
            {product.Discounts && product.Discounts.length > 0 && (
              <span className="text-gray-500 line-through text-xs md:text-xs">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="font-semibold text-sm md:text-base">${formattedFinalPrice}</span>
          </div>
        </div>

        {/* Opciones de pago - fixed height */}
        <div className="mt-2 space-y-1 h-20">
          <div className="text-xs md:text-xs">
            <span>Transferencia: </span>
            <span className="font-semibold">${formattedTransferPrice}</span>
          </div>
          <div className="text-xs md:text-xs">
            <span>3 cuotas de: </span>
            <span className="font-semibold">${formattedThreeInstallment}</span>
          </div>
          <div className="text-xs md:text-xs">
            <span>6 cuotas de: </span>
            <span className="font-semibold">${formattedSixInstallment}</span>
          </div>
        </div>
      </div>

      {/* Botón de acción - fixed height */}
      <div className="mt-auto pt-2 flex justify-center h-12">
        <Link href={`/products/${product.id}`} className="w-full">
          <button className="w-full text-xs rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200 transition-colors">
            Seleccionar opciones
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;