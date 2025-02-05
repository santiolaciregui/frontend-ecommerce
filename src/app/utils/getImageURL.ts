const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Función para construir la URL de forma segura
export const getImageUrl = (path: string) => {
  if (!path) return '/logo-verde-manzana.svg'; // Imagen por defecto
  try {
    return new URL(path, API_URL).toString(); // Combina la URL base y el path
  } catch (error) {
    console.error('Error constructing URL:', error);
    return '/logo-verde-manzana.png'; // Imagen por defecto en caso de error
  }
};