// ProductCard.tsx
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
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const finalPrice = product.finalPrice;
  const formattedFinalPrice = finalPrice.toFixed(2);

  // Buscar las configuraciones específicas
  const transferConfig = paymentFormats.find(
    (config) => config.paymentMethod === PAYMENT_FORMATS_ES.TRANSFER
  );
  const threeInstallmentsConfig = paymentFormats.find(
    (config) => config.paymentMethod === PAYMENT_FORMATS_ES.CUOTAS_3
  );
  const sixInstallmentsConfig = paymentFormats.find(
    (config) => config.paymentMethod === PAYMENT_FORMATS_ES.CUOTAS_6
  );

  // Si la configuración no existe, se usan valores por defecto
  const transferMultiplier = transferConfig
    ? 1 + Number(transferConfig.percentage)
    : 2.10;
  const threeInstallmentMultiplier = threeInstallmentsConfig
    ? 1 + Number(threeInstallmentsConfig.percentage)
    : 2.30;
  const sixInstallmentMultiplier = sixInstallmentsConfig
    ? 1 + Number(sixInstallmentsConfig.percentage)
    : 2.45;

  const transferPrice = finalPrice * transferMultiplier;
  const formattedTransferPrice = transferPrice.toFixed(2);

  const threeInstallment = (finalPrice * threeInstallmentMultiplier) / 3;
  const formattedThreeInstallment = threeInstallment.toFixed(2);

  const sixInstallment = (finalPrice * sixInstallmentMultiplier) / 6;
  const formattedSixInstallment = sixInstallment.toFixed(2);

  return (
    <div className="w-full flex flex-col h-[480px] sm:w-[45%] lg:w-[30%] shadow-sm rounded-md p-4">
      <Link href={`/products/${product.id}`} className="relative w-full h-80 group">
        {/* Imagen principal */}
        <div className="absolute inset-0">
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

        {/* Imagen secundaria - comentada */}
       {/*  <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
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
        </div> */}
      </Link>

      {/* Detalles del producto */}
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

        {/* Opciones de pago */}
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

      {/* Botón de acción */}
      <div className="mt-auto pt-4 flex justify-center">
        <Link href={`/products/${product.id}`}>
          <button className="w-56 text-sm rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200">
            Seleccionar opciones
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
