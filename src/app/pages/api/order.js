import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Ensure this URL points to your backend

// Create a new order (requires authentication)
export const createOrder = async (orderData) => {
  const token = localStorage.getItem('accessToken');  
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update an order by orderId (authenticated users)
export const updateOrderById = async (id, orderData) => {
  const token = localStorage.getItem('accessToken');  
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${id}`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Get all orders (admin-only)
export const fetchOrders = async () => {
  const token = localStorage.getItem('accessToken');  
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Get order details by orderId (authenticated users)
export const fetchOrderById = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Fetch order by tracking ID (public)
export const fetchOrderByTrackingId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/tracking/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Update an order (admin-only)
export const updateOrder = async (id, orderData) => {
  const token = localStorage.getItem('accessToken');  
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${id}`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Delete an order (admin-only)
export const deleteOrderById = async (id) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.delete(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Fetch orders by email and order number (authenticated users)
export const fetchOrdersByEmailAndNumber = async (email, orderNumber, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/search`, {
      email,
      orderNumber,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders by email and order number:', error);
    throw error;
  }
};

export default {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  updateOrderById,
  deleteOrderById,
  fetchOrdersByEmailAndNumber,
  fetchOrderByTrackingId
};
