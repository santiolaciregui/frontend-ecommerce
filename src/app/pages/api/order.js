// services/promotionService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8002'; 

// Obtener todas las promociones
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};


// Crear una nueva promoción
export const createOrders = async (promotionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, promotionData);
    return response.data;
  } catch (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }
};

// Obtener una promoción por ID
export const fetchPromotionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    throw error;
  }
};

// Actualizar una promoción
export const updatePromotion = async (id, promotionData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/promotions/${id}`, promotionData);
    return response.data;
  } catch (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }
};

// Eliminar una promoción
export const deletePromotion = async ({id}) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
};

export default {
  fetchPromotions,
  fetchCreditCards,
  createPromotion,
  fetchPromotionById,
  updatePromotion,
  deletePromotion
};
