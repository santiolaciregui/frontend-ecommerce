'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Option, CartItem } from './types';

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, options: Option[]) => void;
  updateCartItemQuantity: (productId: number, options: Option[], quantity: number) => void;
  getTotalCart: () => number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'my_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const { cart: loadedCart, timestamp } = parsedCart;
      const now = new Date().getTime();
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

      if (now - timestamp < oneDayInMilliseconds) {
        setCart(loadedCart);
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      const timestamp = new Date().getTime();
      const dataToStore = JSON.stringify({ cart, timestamp });
      localStorage.setItem(CART_STORAGE_KEY, dataToStore);
    }
  }, [cart, isInitialLoad]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem.product.id === item.product.id &&
          JSON.stringify(cartItem.options) === JSON.stringify(item.options)
      );
  
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.product.id === item.product.id &&
          JSON.stringify(cartItem.options) === JSON.stringify(item.options)
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prevCart, item];
      }
    });
  };


  const removeFromCart = (productId: number, options: Option[]) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          item.product.id !== productId ||
          JSON.stringify(item.options) !== JSON.stringify(options)
      )
    );
  };

  const updateCartItemQuantity = (productId: number, options: Option[], quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && JSON.stringify(item.options) === JSON.stringify(options)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalCart = () => {
    return cart.reduce((total, cartItem) => {
      return total + cartItem.product.price * cartItem.quantity;
    }, 0);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <CartContext.Provider value={{ cart, getTotalCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart }}>
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
