import axios from 'axios';

const API_BASE_URL = 'http://localhost:8002'; // Cambia esto según tu configuración de backend

// Obtener todas las órdenes
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Obtener detalles de una orden por ID
export const fetchOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Crear una nueva orden
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Actualizar una orden existente
export const updateOrder = async (id, orderData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Eliminar una orden por ID
export const deleteOrderById = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export default {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  deleteOrderById,
};
