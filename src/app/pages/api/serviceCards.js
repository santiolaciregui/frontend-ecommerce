// src/services/apiServiceCards.js

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Fetch card providers
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
  }
};
