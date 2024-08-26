import axios from 'axios';

const API_BASE_URL = 'http://localhost:8002'; // Update this URL if your backend is hosted elsewhere

export const fetchProducts = async ({
  categoryId,
  limit = 8,
  searchParams = {}
}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: {
        categoryId,
        limit,
        ...searchParams
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    console.log('productos: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductByID = async ({
   id,
  }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const deleteProductByID = async ({
  id,
 }) => {
   try {
     const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
     return response.data;
   } catch (error) {
     console.error('Error fetching products:', error);
     throw error;
   }
 };

// Add more API calls as needed

export default {
  fetchProducts,
  fetchAllProducts,
  fetchCategories,
  fetchProductByID,
  createProduct,
  deleteProductByID
};
