'use client';

import Image from "next/image";
import { useCart } from '../context/CartContext';
import Link from "next/link";
import { Option } from "../context/types";

const CartModal = () => {
  const { cart, getTotalCart, removeFromCart} = useCart();

  const generateUniqueKey = (productId: number, options: Option[]) => {
    // Check if options exist, if yes, include them in the key, otherwise just use the productId
    if (options && options.length > 0) {
      return `${productId}-${options.map(option => option.id).join('-')}`;
    }
    return `${productId}`;
  };

  return (
    <div className='w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20'>
      {cart.length === 0 ? (
        <div>El carrito está vacío</div>
      ) : (
        <div className="">
          <h2 className="text-xl">Carrito</h2>
          <br />
          <div className="flex flex-col gap-8">
            {cart.map((item) => (
              <div className="flex gap-4" key={generateUniqueKey(item.product.id, item.options)}>
                <Image
                  src='/logo-verde-manzana.svg'
                  alt={''}
                  width={62}
                  height={96}
                  className="object-cover rounded-md"
                />
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <div className="flex justify-between items-center gap-8">
                      <h3 className="font-semibold">{item.product.name}</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.options?.map((option) => (
                        <span key={option.name}>{option.name}</span>
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
                      onClick={() => removeFromCart(item.product.id, item.options)}
                    >
                      Eliminar
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="">
            <br />
            <div className="flex items-center justify-between font-semibold">
              <span className="">Subtotal</span>
              <span className="">${getTotalCart()}</span>
            </div>
            <p className="text-gray-500 text-sm mt--2 mb-4">
              Envio calculado al momento de finalizar la compra
            </p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">Ver Carrito</button>
              <Link href='/checkout' className="rounded-md py-3 px-4 bg-green-500 text-white">Finalizar compra</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartModal;
