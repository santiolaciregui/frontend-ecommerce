'use client';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product, Option } from '../context/types';

const Add = ({
  product,
  selectedOptions,
  stockNumber,
  quantity
}: {
  product: Product;
  selectedOptions: Option[];
  stockNumber: number;
  quantity: number;
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity > stockNumber) {
      alert('Not enough stock available');
      return;
    }

    addToCart({
      product,
      options: selectedOptions, // Pass the selected options instead of variantId
      quantity,
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <button 
        className="2-36 text-sm rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200"
        onClick={handleAddToCart}
      >
        Agregar al carrito
      </button>
    </div>
  );
}

export default Add;
