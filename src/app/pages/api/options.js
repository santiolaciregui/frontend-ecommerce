import axios from 'axios';

const API_BASE_URL = 'https://backend-ecommerce-aecr.onrender.com'; 


export const fetchOptions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/options`);
    return response.data;
  } catch (error) {
    console.error('Error fetching options:', error);
    throw error;
  }
};


export default {
    fetchOptions
}