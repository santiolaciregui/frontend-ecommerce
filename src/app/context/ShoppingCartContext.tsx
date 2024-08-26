import { createContext } from "react";
import { Product } from "./types";

export type CartItem = {
  product: Product;
  quantity: number;
  variant: string | null;
};

type ShoppingCartContextType = {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    variant: string | null,
  ) => void;
  removeFromCart: (productId: string, variantId: string | null) => void;
  updateCartItemQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => void;
  clearCart: () => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
});

export default ShoppingCartContext;