import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ; 


//HACER QUE ESTE METODO TRAIGA [sillon:{name: '', subcats:[{ca,sa}]}]
// Obtener todas las categorías
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Obtener todas las categorías padre
export const fetchParentCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/parents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    throw error;
  }
};

// Obtener todas las subcategorías
export const fetchSubcategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/subcategories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

// Obtener todas las subcategorías de una categoría padre
export const fetchSubcategoriesByParent = async (parentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${parentId}/subcategories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

// Obtener una categoría por ID
export const fetchCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Crear una nueva categoría (Admin-only)
export const createCategory = async (categoryData) => {
  const token = localStorage.getItem('accessToken');  
  try {
    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update a category (Admin-only)
export const updateCategory = async (id, categoryData) => {
  const token = localStorage.getItem('accessToken');  
  try {
    const response = await axios.put(`${API_BASE_URL}/categories/${id}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete a category (Admin-only)
export const deleteCategory = async (id) => {
  const token = localStorage.getItem('accessToken');  
  try {
    const response = await axios.delete(`${API_BASE_URL}/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};


export default {
  fetchCategories,
  fetchParentCategories, // New method for fetching parent categories
  fetchSubcategories, // New method for fetching subcategories
  fetchSubcategoriesByParent,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};