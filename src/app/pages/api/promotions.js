import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Ensure the backend URL is set

// Fetch all promotions
export const fetchPromotions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promotions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

// Fetch credit cards
export const fetchCreditCards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-cards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching credit cards:', error);
    throw error;
  }
};

// Fetch providers
export const fetchProviders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-cards/card-providers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card providers:', error);
    throw error;
  }
};

// Fetch banks available for a specific provider
export const fetchBanksByProvider = async (providerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-cards/banks`, {
      params: { providerId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching banks:', error);
    throw error;
  }
};

// Fetch available installment options for a specific bank and card
export const fetchInstallmentsByBank = async (bankId, cardId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-cards/installments`, {
      params: { bankId, cardId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching installments:', error);
    throw error;
  }
};

// Create a new promotion (requires admin authentication)
export const createPromotion = async (promotionData) => {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  try {
    const response = await axios.post(`${API_BASE_URL}/promotions`, promotionData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }
};

// Fetch a promotion by ID
export const fetchPromotionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    throw error;
  }
};

// Update a promotion (requires admin authentication)
export const updatePromotion = async (id, promotionData) => {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  try {
    const response = await axios.put(`${API_BASE_URL}/promotions/${id}`, promotionData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }
};

// Delete a promotion (requires admin authentication)
export const deletePromotion = async (id) => {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  try {
    const response = await axios.delete(`${API_BASE_URL}/promotions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
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
  fetchProviders,
  fetchInstallmentsByBank,
  createPromotion,
  fetchPromotionById,
  updatePromotion,
  deletePromotion,
};
