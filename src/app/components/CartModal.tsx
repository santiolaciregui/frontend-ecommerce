'use client';

import Image from "next/image";
import { useCart } from '../context/CartContext';
import Link from "next/link";
import { Option } from "../context/types";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart } = useCart();

  useEffect(() => {
  }, [cart]);

  
  const generateUniqueKey = (item: any) => {
    const optionsKey = item.Options && item.Options.length > 0
      ? `-${item.Options.map((opt: Option) => opt.id).sort().join('-')}`
      : '';
    return `${item.Product.id}${optionsKey}`;
  };

  if (!isOpen) return null;

  return (
    <div className='w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20'>
     {cart === null || cart.length === 0 ? (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-xl font-semibold text-gray-700">El carrito está vacío</p>
      <p className="text-sm text-gray-500 mt-2">Parece que no tienes productos en tu carrito.</p>
      <Link
        href="/products" 
        className="mt-4 py-3 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors"
      >
        Ir a comprar
      </Link>
    </div>
  ) : (
        <div>
          <h2 className="text-xl">Carrito</h2>
          <br />
          <div className="flex flex-col gap-8">
            {cart.map((item) => (
              <div className="flex gap-4" key={generateUniqueKey(item)}>
                <Image
                  src={item.Product.Images[0] ? `${API_URL}${item.Product.Images[0].url}` : '/logo-verde-manzana.svg'}
                  alt={''}
                  width={62}
                  height={96}
                  className="object-cover rounded-md"
                />
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <div className="flex justify-between items-center gap-8">
                      <h3 className="font-semibold">{item.Product.name}</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.Options?.map((option) => (
                        <span key={option.id}>{option.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Cantidad:</span>
                      <span className="text-black">{item.quantity}</span>
                    </div>
                    <span
                      className="text-blue-500 cursor-pointer"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fas fa-trash text-gray-500"></i>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <br />
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span>${cart.reduce((acc, item) => acc + item.Product.finalPrice * item.quantity, 0).toFixed(2)}</span>
            </div>
            <p className="text-gray-500 text-sm mt--2 mb-4">
              Envio calculado al momento de finalizar la compra
            </p>
            <div className="flex justify-between text-sm">
              <Link href='/checkout' className="rounded-md py-3 px-4 bg-green-500 text-white" onClick={onClose}>
                Finalizar compra
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartModal;