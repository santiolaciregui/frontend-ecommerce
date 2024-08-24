import { createContext } from "react";
import { Product, Variant } from "./types";
import { noop } from "@/helpers/utils";

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
  addToCart: noop,
  removeFromCart: noop,
  updateCartItemQuantity: noop,
  clearCart: noop,
});

export default ShoppingCartContext;