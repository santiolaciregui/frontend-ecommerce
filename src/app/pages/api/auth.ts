import axios from 'axios';

interface LoginParams {
  username: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ; 

export const login = async ({ username, password }: LoginParams): Promise<void> => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {
    username,
    password,
  }, {
    withCredentials: true, // To send HTTP-only cookies
  });

  if (res.status !== 200) {
    throw new Error('Error en la autenticación');
  }
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
    withCredentials: true,
  });
};
