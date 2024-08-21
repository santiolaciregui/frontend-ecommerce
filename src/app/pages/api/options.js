import axios from 'axios';

const API_BASE_URL = 'http://localhost:8002'; 


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