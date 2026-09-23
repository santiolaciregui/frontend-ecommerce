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

    addToCart(product.id, quantity, selectedOptions.map(option => option.id));
  };

  return (
    <div className='flex flex-col gap-4'>
      <button 
        className="text-sm rounded-md ring-1 ring-zinc-800 text-zinc-800 py-2 px-4 hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:bg-zinc-200"
        onClick={handleAddToCart}
      >
        Agregar al carrito
      </button>
    </div>
  );
}

export default Add;
