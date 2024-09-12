// services/discountService.js

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;    // Update this URL if your backend is hosted elsewhere

// Obtener todos los descuentos
export const fetchDiscounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discounts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    throw error;
  }
};

// Obtener un descuento por ID
export const fetchDiscountById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discounts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discount:', error);
    throw error;
  }
};

// Crear un nuevo descuento
export const createDiscount = async (discountData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/discounts`, discountData);
    return response.data;
  } catch (error) {
    console.error('Error creating discount:', error);
    throw error;
  }
};

// Actualizar un descuento
export const updateDiscount = async (id, discountData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/discounts/${id}`, discountData);
    return response.data;
  } catch (error) {
    console.error('Error updating discount:', error);
    throw error;
  }
};

// Eliminar un descuento
export const deleteDiscountByID = async ({id}) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/discounts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting discount:', error);
    throw error;
  }
};

export default {
  fetchDiscounts,
  fetchDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscountByID
};
