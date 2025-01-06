import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Ensure your backend URL is set

// Fetch products with optional filters
export const fetchProducts = async ({
  categoryId,
  subcategoryId,
  limit = 9,
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

// Create a new product (requires authentication)
export const createProduct = async (productData) => {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  try {
    const response = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Fetch all products
export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    console.log('Products:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch product details by ID
export const fetchProductByID = async ({ id }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Fetch products by category
export const fetchProductsByCategory = async ({ categoryId }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Delete a product by ID (requires admin authentication)
export const deleteProductByID = async ({ id }) => {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  try {
    const response = await axios.delete(`${API_BASE_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Update a product by ID (requires admin authentication)
export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  try {
    // Inspect FormData for debugging
    console.log("Content of productData:");
    for (const pair of productData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
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
