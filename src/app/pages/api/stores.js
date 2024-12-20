import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Fetch all stores (public)
export const fetchStores = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

// Create a store (requires admin authentication)
export const createStore = async (storeData) => {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  try {
    const response = await axios.post(`${API_BASE_URL}/stores`, storeData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
};

// Fetch a store by ID (public)
export const fetchStoreById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
};

// Update a store (requires admin authentication)
export const updateStore = async (id, storeData) => {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  try {
    const response = await axios.put(`${API_BASE_URL}/stores/${id}`, storeData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
};

// Delete a store (requires admin authentication)
export const deleteStore = async (id) => {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  try {
    const response = await axios.delete(`${API_BASE_URL}/stores/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting store:', error);
    throw error;
  }
};

export default {
  fetchStores,
  createStore,
  fetchStoreById,
  updateStore,
  deleteStore,
};
