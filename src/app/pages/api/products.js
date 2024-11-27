import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;   // Update this URL if your backend is hosted elsewhere

export const fetchProducts = async ({
  categoryId,
  subcategoryId,
  limit = 8,
  page = 0,
  searchParams = {}
}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: {
        categoryId,
        subcategoryId,
        limit,
        page,
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

  export const fetchProductsByCategory = async ({
    categoryId,
   }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/category/${categoryId}`);
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

 export const updateProduct = async (id, productData) => {
  try {
    // Inspeccionar FormData
    console.log("Contenido de productData:");
    for (const pair of productData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export default {
  fetchProductsByCategory,
  fetchProducts,
  fetchAllProducts,
  fetchProductByID,
  createProduct,
  deleteProductByID,
  updateProduct
};
