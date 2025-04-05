'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { refreshToken, logout as authLogout } from '../pages/api/authService';
import jwt from 'jsonwebtoken';
import { useUser } from '../context/UserContext';

// Función para verificar si el token ha expirado
const isTokenExpired = (token: string) => {
  try {
    const decodedToken = jwt.decode(token) as { exp: number };
    if (!decodedToken || !decodedToken.exp) return true;
    
    const currentTime = Date.now() / 1000; // Tiempo en segundos
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error al verificar expiración del token:', error);
    return true; // Si hay error, consideramos que el token ha expirado
  }
};

// Lista de rutas privadas que requieren autenticación
const privateRoutes = [/^\/admin/]; // Captura cualquier ruta que comience con '/admin'

const useAuth = () => {
  const { user, setUser, logout: contextLogout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Función para cerrar sesión y redirigir al login
  const logout = () => {
    authLogout(); // Limpia localStorage
    contextLogout(); // Actualiza el contexto
    router.push('/login');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const currentPath = window.location.pathname;

      // Verificamos si la ruta actual es privada
      const isPrivateRoute = privateRoutes.some(route => route.test(currentPath));
      
      if (isPrivateRoute) {
        // Si no hay token, redirigir al login
        if (!accessToken) {
          logout();
          setIsLoading(false);
          return;
        }

        // Verificamos si el token ha expirado
        if (isTokenExpired(accessToken)) {
          try {
            // Intentar renovar el token con el refreshToken
            const newAccessToken = await refreshToken();
            if (!newAccessToken) {
              logout();
              setIsLoading(false);
              return;
            }
            
            // Decodificar el nuevo token para actualizar el usuario en el contexto
            const decodedToken = jwt.decode(newAccessToken) as any;
            if (decodedToken && decodedToken.user) {
              setUser(decodedToken.user);
            }
          } catch (error) {
            console.error('Error al renovar el token:', error);
            logout();
            setIsLoading(false);
            return;
          }
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, setUser]);

  return { 
    isAuthenticated: !!user, 
    isLoading,
    logout
  };
};

export default useAuth;
