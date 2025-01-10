import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createCreditCard = async (creditCardData) => {
  const token = localStorage.getItem('accessToken');  
  try {
    const response = await axios.post(`${API_BASE_URL}/credit-cards`, creditCardData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating credit card:', error);
    throw error;
  }
};