import React from "react";
import { Product, Discount } from "../context/types";
import Image from "next/image";
import Link from "next/link";
import Add from "./Add";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const currentPrice = product.price;

  // Si hay descuentos, calculamos el precio final aplicando el mayor descuento activo
  const activeDiscounts = product.Discounts?.filter(discount => discount.active);
  
  // Si existen descuentos activos, selecciona el de mayor porcentaje
  const bestDiscount = activeDiscounts?.reduce((max, discount) => 
    discount.percentage > max.percentage ? discount : max, activeDiscounts[0]);

  const finalPrice = bestDiscount
    ? (currentPrice * (1 - bestDiscount.percentage / 100)).toFixed(2)
    : currentPrice.toFixed(2);

  const discountPercentage = bestDiscount?.percentage || null;

  // Calcular la cuota mensual (ejemplo: 12 meses)
  const monthlyInstallment = (parseFloat(finalPrice) / 12).toFixed(2);


  const API_URL = "http://localhost:3000"
  return (
    <Link href={'/products/' + product.id} className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]" key={product.id}>
      <div className="relative w-full h-80">
  {discountPercentage && (
    <div className="absolute top-2 left-2 bg-green-500 text-white text-sm font-bold py-1 px-2 rounded z-20">
      {discountPercentage}% OFF 
    </div>
  )}
  
  {/* Muestra la imagen del producto si existe, de lo contrario muestra el logo */}
      <Image
        src={product.Images?.length > 0 ? `${API_URL}${product.Images[0].url}` : '/logo-verde-manzana.svg'}
        alt={product.Images?.length > 0 ?  'Product Image' : 'Logo'}
        layout="fill"
        sizes="25vw"
        className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
      />
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
