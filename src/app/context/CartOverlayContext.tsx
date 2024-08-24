import { createContext, useContext } from "react";
import { noop } from "../helpers/utils";

export const useCartOverlay = () => useContext(CartOverlayContext);

const CartOverlayContext = createContext({
  isCartOpen: false,
  openCart: noop,
  closeCart: noop,
});

export default CartOverlayContext;