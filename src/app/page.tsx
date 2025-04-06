// app/page.tsx
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
    const loadParentCategories = async () => {
      try {
        const categoriesData = await fetchCategoriesDashboard();
        setParentCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

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

  // Este callback se pasa al CategoriesMenu
  const handleCategoryClick = (categoryId: number) => {
    // Mandar al usuario a /products con el query param ?category=ID
    router.push(`/products?category=${categoryId}`);
  };
  

  return (
    <div className="text-center">
      {carouselImages.length > 0 ? (
        <PromoCarousel images={carouselImages} />
      ) : (
        <div>Cargando imágenes...</div>
      )}

      <br />

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
