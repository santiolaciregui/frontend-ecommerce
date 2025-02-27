// page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PromoCarousel from './components/PromoCarousel';
import { fetchCategoriesDashboard } from './pages/api/category';
import { fetchCarouselImages } from './pages/api/dashboard';
import CategoriesMenu from './components/CategoriesMenu';

const HomePage = () => {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    // Cargar categorías
    const loadParentCategories = async () => {
      try {
        const categoriesData = await fetchCategoriesDashboard();
        setParentCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Cargar imágenes del carrusel desde la API
    const loadCarouselImages = async () => {
      try {
        const imagesData = await fetchCarouselImages();
        setCarouselImages(imagesData);
      } catch (error) {
        console.error('Error fetching carousel images:', error);
      }
    };

    loadParentCategories();
    loadCarouselImages();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/products?page=&category=${categoryId}`);
  };

  return (
    <div className="text-center">
      {/* Promo Carousel */}
      {carouselImages.length > 0 ? (
        <PromoCarousel images={carouselImages} />
      ) : (
        <div>Cargando imágenes...</div>
      )}
      <br />

      {/* Sección de categorías */}
      <div>
        <h1 className="text-2xl font-bold my-2">Nuestros Productos</h1>
        <CategoriesMenu 
          categories={parentCategories} 
          onCategoryClick={handleCategoryClick} 
        />
      </div>
    </div>
  );
};

export default HomePage;
