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
    // Calcular el precio final del producto
    const currentPrice = item.product.price;
  
    // Filtrar los descuentos activos
    const activeDiscounts = item.product.Discounts?.filter(discount => discount.active);
  
    // Si existen descuentos activos, selecciona el de mayor porcentaje
    const bestDiscount = activeDiscounts?.reduce((max, discount) => 
      discount.percentage > max.percentage ? discount : max, activeDiscounts[0]);
  
    // Calcular el precio final aplicando el descuento si lo hay
    const finalPrice = bestDiscount
      ? currentPrice * (1 - bestDiscount.percentage / 100)
      : currentPrice;
  
    // Actualiza el producto con el precio final
    const updatedItem = {
      ...item,
      product: {
        ...item.product,
        price: finalPrice,
      },
    };
  
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem.product.id === updatedItem.product.id &&
          JSON.stringify(cartItem.options) === JSON.stringify(updatedItem.options)
      );
  
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.product.id === updatedItem.product.id &&
          JSON.stringify(cartItem.options) === JSON.stringify(updatedItem.options)
            ? { ...cartItem, quantity: cartItem.quantity + updatedItem.quantity }
            : cartItem
        );
      } else {
        return [...prevCart, updatedItem];
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
