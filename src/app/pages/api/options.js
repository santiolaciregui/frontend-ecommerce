import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;  // Update this URL if your backend is hosted elsewhere


export const fetchOptions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/options`);
    return response.data;
  } catch (error) {
    console.error('Error fetching options:', error);
    throw error;
  }
};

// Crear una nueva opcion
export const createOption = async (optionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/options`, optionData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};


export default {
    fetchOptions,
    createOption
}