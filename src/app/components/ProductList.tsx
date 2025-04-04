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

  if (loading) return <div className="text-center py-8">Cargando medios de pago...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="h-full">
          <ProductCard
            product={product}
            paymentFormats={paymentFormats}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;