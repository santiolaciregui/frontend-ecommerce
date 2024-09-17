import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Obtener todas las sucursales
export const fetchStores = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

// Crear una nueva sucursal
export const createStore = async (storeData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/stores`, storeData);
    return response.data;
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
};

// Obtener una sucursal por ID
export const fetchStoreById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
};

// Actualizar una sucursal
export const updateStore = async (id, storeData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/stores/${id}`, storeData);
    return response.data;
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
};

// Eliminar una sucursal
export const deleteStore = async ({id}) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/stores/${id}`);
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
  deleteStore
};