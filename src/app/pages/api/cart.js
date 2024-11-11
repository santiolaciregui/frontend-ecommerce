import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Update this URL if your backend is hosted elsewhere

// Add an item to the cart
export const addToCart = async (sessionId, productId, quantity, optionIds) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/add`, { sessionId, productId, quantity, optionIds });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Remove an item from the cart
export const removeFromCart = async (sessionId, cartItemId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/remove`, { sessionId, cartItemId });
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

// Update the quantity of a cart item
export const updateCartItemQuantity = async (sessionId, cartItemId, quantity) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/update`, { sessionId, cartItemId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

// Clear the cart
export const clearCart = async (sessionId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/clear`, { sessionId });
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

export default {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
};
