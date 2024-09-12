import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAdminAuthStatus = async (): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_URL}/auth/status`, {
      withCredentials: true,
    });
    console.log(res.status);

    return res.status === 200;
  } catch (error) {
    return false;
  }
};
