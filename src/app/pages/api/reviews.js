// api/reviews.js
import axios from 'axios';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// Fetch all review images
export const fetchReviewImages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews/images`);
    return response.data.images;
  } catch (error) {
    console.error('Error fetching review images:', error);
    throw error;
  }
};

// Upload review images (admin only)
export const uploadReviewImages = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

    const response = await axios.post(`${API_BASE_URL}/reviews/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading review images:', error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = '/login';
    }
    throw error;
  }
};

// Delete review image (admin only)
export const deleteReviewImage = async (imageUrl) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // Extraer el nombre del archivo de la URL completa
    const filename = imageUrl.split('/').pop();
    
    const response = await axios.delete(`${API_BASE_URL}/reviews/images/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting review image:', error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = '/login';
    }
    throw error;
  }
};

// Delete all review images (admin only)
export const deleteAllReviewImages = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${API_BASE_URL}/reviews/images`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting all review images:', error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = '/login';
    }
    throw error;
  }
};

// Update (replace) all review images (admin only)
export const updateReviewImages = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/reviews/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating review images:', error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = '/login';
    }
    throw error;
  }
};