'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Option, CartItem } from './types';
import { addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, updateCartItemQuantity as apiUpdateCartItemQuantity, clearCart as apiClearCart } from '../pages/api/cart';


type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: number, options: Option[]) => Promise<void>;
  updateCartItemQuantity: (productId: number, options: Option[], quantity: number) => Promise<void>;
  getTotalCart: () => number;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'my_cart';
const SESSION_ID_KEY = 'session_id';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Generate or retrieve session ID
  const sessionId = localStorage.getItem(SESSION_ID_KEY) || '' ;
  localStorage.setItem(SESSION_ID_KEY, sessionId);

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

  const addToCart = async (item: CartItem) => {
    try {
      const optionIds = item.options.map(option => option.id);
      await apiAddToCart(sessionId, item.product.id, item.quantity, optionIds);
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (cartItem) =>
            cartItem.product.id === item.product.id &&
            JSON.stringify(cartItem.options.map(o => o.id).sort()) === JSON.stringify(optionIds.sort())
        );

        if (existingItemIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += item.quantity;
          return updatedCart;
        } else {
          return [...prevCart, item];
        }
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await apiRemoveFromCart(sessionId, cartItemId);
      setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await apiUpdateCartItemQuantity(sessionId, cartItemId, quantity);
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      await apiClearCart(sessionId);
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalCart = () => {
    return cart.reduce((total, cartItem) => {
      return total + cartItem.product.price * cartItem.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      getTotalCart, 
      addToCart, 
      updateCartItemQuantity: (productId: number, options: Option[], quantity: number) => 
        updateCartItemQuantity(productId, quantity),
      removeFromCart, 
      clearCart 
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
