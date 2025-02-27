// api/paymentFormats.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Asegúrate de que esta URL apunte a tu backend

// Obtener todas las configuraciones de medios de pago (ruta pública)
export const fetchPaymentFormats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paymentFormat`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment formats:', error);
    throw error;
  }
};

// Obtener una configuración por ID (ruta pública)
export const fetchPaymentFormatById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paymentFormat/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment format:', error);
    throw error;
  }
};

// Crear una nueva configuración (ruta admin)
export const createPaymentFormat = async (data) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.post(`${API_BASE_URL}/paymentFormat`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment format:', error);
    throw error;
  }
};

// Actualizar una configuración existente (ruta admin)
export const updatePaymentFormat = async (id, data) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.put(`${API_BASE_URL}/paymentFormat/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating payment format:', error);
    throw error;
  }
};

// Eliminar una configuración (ruta admin)
export const deletePaymentFormat = async (id) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.delete(`${API_BASE_URL}/paymentFormat/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting payment format:', error);
    throw error;
  }
};

export default {
  fetchPaymentFormats,
  fetchPaymentFormatById,
  createPaymentFormat,
  updatePaymentFormat,
  deletePaymentFormat,
};
