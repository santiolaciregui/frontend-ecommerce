import { createContext, useContext } from "react";

export const useCartOverlay = () => useContext(CartOverlayContext);

const CartOverlayContext = createContext({
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
});

export default CartOverlayContext;