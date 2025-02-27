// api/dashboard.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// Upload carousel images
export const uploadCarouselImages = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

    const response = await axios.post(`${API_BASE_URL}/dashboard/carousel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}` // Assuming you store token in localStorage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading carousel images:', error);
    throw error;
  }
};

// Fetch all carousel images
export const fetchCarouselImages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/carousel`);
    return response.data.images;
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    throw error;
  }
};

// Delete carousel image
export const deleteCarouselImage = async (filename) => {
  try {
    const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
    const response = await axios.delete(`${API_BASE_URL}/dashboard/carousel/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}` // Assuming you store token in localStorage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting carousel image:', error);
    throw error;
  }
};

// Delete all carousel images
export const deleteAllCarouselImages = async () => {
  try {
    const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
    const response = await axios.delete(`${API_BASE_URL}/dashboard/carousel`, {
      headers: {
        Authorization: `Bearer ${token}` // Assuming you store token in localStorage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting all carousel images:', error);
    throw error;
  }
};

// Update (replace) all carousel images
export const updateCarouselImages = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
    const response = await axios.put(`${API_BASE_URL}/dashboard/carousel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}` // Assuming you store token in localStorage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating carousel images:', error);
    throw error;
  }
};