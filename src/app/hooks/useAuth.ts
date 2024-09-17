'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { refreshToken } from '../pages/api/authService';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

// Función para verificar si el token ha expirado
const isTokenExpired = (token: string) => {
    const decodedToken = jwt.decode(token) as { exp: number }; // Use jwt.decode
    const currentTime = Date.now() / 1000; // Tiempo en segundos
    return decodedToken.exp < currentTime;
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        // Si no hay token, redirigir al login
        router.push('/login');
        setIsLoading(false);
        return;
      }

      // Verificamos si el token ha expirado
      if (isTokenExpired(accessToken)) {
        try {
          // Intentar renovar el token con el refreshToken
          const newAccessToken = await refreshToken();
          if (!newAccessToken) {
            router.push('/login');
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error al renovar el token:', error);
          router.push('/login');
          setIsLoading(false);
          return;
        }
      }

      // Si todo está bien, el usuario está autenticado
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, isLoading };
};
export default useAuth;
