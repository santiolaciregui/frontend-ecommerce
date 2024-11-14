'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Option, CartItem, Cart } from './types';
import { v4 as uuidv4 } from 'uuid';
import * as cartService from '../pages/api/cart';

type CartContextType = {
  cart: CartItem[] | null;
  addToCart: (productId: number, quantity: number, optionIds: number[]) => Promise<void>;
   nremoveFromCart: (cartItemId: number) => Promise<void>;
  updateCartItemQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

const SESSION_ID_KEY = 'session_id';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize session ID and load cart
  useEffect(() => {
    const initializeCart = async () => {
        let storedSessionId = localStorage.getItem(SESSION_ID_KEY);
        if (!storedSessionId) {
          storedSessionId = uuidv4();
          localStorage.setItem(SESSION_ID_KEY, storedSessionId);
        }
        setSessionId(storedSessionId);
        try {
          setIsLoading(true);
          const response = await cartService.getCart(storedSessionId);
          setCart(response);
        } catch (err) {
          setError('Failed to load cart');
          console.error('Error loading cart:', err);
        } finally {
          setIsLoading(false);
        }
    };
    initializeCart();
  }, []);

  const addToCart = async (productId: number, quantity: number, optionIds: number[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartService.addToCart(sessionId, productId, quantity, optionIds);
      setCart(response);
    } catch (err) {
      setError('Failed to add item to cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartService.removeFromCart(sessionId, cartItemId);
      setCart(response);
    } catch (err) {
      setError('Failed to remove item from cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartService.updateCartItemQuantity(sessionId, cartItemId, quantity);
      setCart(response.items);
    } catch (err) {
      setError('Failed to update item quantity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await cartService.clearCart(sessionId);
      setCart(null);
    } catch (err) {
      setError('Failed to clear cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalCart = () => {
    return cart || 0;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      clearCart,
      isLoading,
      error
    }}>
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