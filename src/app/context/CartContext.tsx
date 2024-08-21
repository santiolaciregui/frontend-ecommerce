'use client'
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from './types';

type CartItem = {
  product: Product;
  variantId: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  getTotalCart() : number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem.product.id === item.product.id &&
          cartItem.variantId === item.variantId
      );

      if (existingItem) {
        // Actualiza la cantidad del producto existente
        return prevCart.map((cartItem) =>
          cartItem.product.id === item.product.id &&
          cartItem.variantId === item.variantId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        // Añade el nuevo producto al carrito
        return [...prevCart, item];
      }
    });
  };

  const getTotalCart = () => {
    return cart.reduce((total, cartItem) => {
      return total + (cartItem.product.price! * cartItem.quantity);
    }, 0);
  };
  


  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, getTotalCart, addToCart, updateCartItemQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
