// services/promotionService.js

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;    // Update this URL if your backend is hosted elsewhere

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

export const fetchProviders = async () => {
    const response = await fetch(`${API_BASE_URL}/credit-cards/card-providers`);
    console.log('response: ',response)
    if (!response.ok) {
      throw new Error('Failed to fetch card providers');
    }
    return response.json();
  };

  // Fetch banks available for a specific provider
  export const fetchBanksByProvider = async (providerId) => {
    const response = await fetch(`${API_BASE_URL}/credit-cards/banks?providerId=${providerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch banks');
    }
    return response.json();
  };

  // Fetch available installment options for a specific bank
// Fetch available installment options for a specific bank and card
export const fetchInstallmentsByBank = async (bankId, cardId) => {
  const response = await fetch(`${API_BASE_URL}/credit-cards/installments?bankId=${bankId}&cardId=${cardId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch installments');
  }
  return response.json();
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
  fetchBanksByProvider,
  fetchCreditCards,
  fetchProviders,
  fetchInstallmentsByBank,
  createPromotion,
  fetchPromotionById,
  updatePromotion,
  deletePromotion
};
