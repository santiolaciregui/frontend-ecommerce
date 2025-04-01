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
    console.error('Error message:', error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = '/login';
    }
    throw error;
  }
};