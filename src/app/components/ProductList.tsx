// ProductList.tsx
'use client';

import React, { useEffect, useState } from "react";
import { PaymentFormat, Product } from "../context/types";
import ProductCard from "./ProductCard";
import paymentFormatService from "../pages/api/paymentFormat";


type Props = {
  products: Product[];
};

const ProductList = ({ products }: Props) => {
  const [paymentFormats, setPaymentFormats] = useState<PaymentFormat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentFormats = async () => {
      try {
        const data = await paymentFormatService.fetchPaymentFormats();
        setPaymentFormats(data);
      } catch (err) {
        console.error("Error fetching payment formats:", err);
        setError("Error al obtener los medios de pago");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentFormats();
  }, []);

  if (loading) return <div>Cargando medios de pago...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='mt-12 flex gap-x-8 gap-y-8 justify-start flex-wrap items-stretch'>
      {products.map((product) => (
        <ProductCard
          product={product}
          paymentFormats={paymentFormats}
          key={product.id}
        />
      ))}
    </div>
  );
};

export default ProductList;
