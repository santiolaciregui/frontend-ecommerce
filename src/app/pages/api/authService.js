// services/authService.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });
    const { accessToken, refreshToken } = response.data;

    // Guardar los tokens en localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('oye tio')
  console.log(localStorage)
};

// Renovar el token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });

    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error during token refresh:', error);
    throw error;
  }
};

export default {
  login,
  logout,
  refreshToken,
};
