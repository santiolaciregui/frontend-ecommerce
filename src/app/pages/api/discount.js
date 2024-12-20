import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;  // Ensure this URL points to your backend

// Get all discounts (public route)
export const fetchDiscounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discounts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    throw error;
  }
};

// Get a discount by ID (public route)
export const fetchDiscountById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discounts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discount:', error);
    throw error;
  }
};

// Create a new discount (admin-only route)
export const createDiscount = async (discountData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/discounts`, discountData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating discount:', error);
    throw error;
  }
};

// Update a discount (admin-only route)
export const updateDiscount = async (id, discountData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/discounts/${id}`, discountData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating discount:', error);
    throw error;
  }
};

// Delete a discount (admin-only route)
export const deleteDiscountByID = async (id, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/discounts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting discount:', error);
    throw error;
  }
};

export default {
  fetchDiscounts,
  fetchDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscountByID,
};
