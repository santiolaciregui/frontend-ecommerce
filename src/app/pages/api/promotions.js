// services/promotionService.js

import axios from 'axios';

const API_BASE_URL = 'https://backend-ecommerce-aecr.onrender.com';  // Update this URL if your backend is hosted elsewhere

// Obtener todas las promociones
export const fetchPromotions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promotions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

// Obtener todas las tarjetas de crédito
export const fetchCreditCards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-cards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching credit cards:', error);
    throw error;
  }
};

// Crear una nueva promoción
export const createPromotion = async (promotionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/promotions`, promotionData);
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
