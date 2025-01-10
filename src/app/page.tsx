'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PromoCarousel from './components/PromoCarousel';
import { fetchCategoriesDashboard } from './pages/api/category';
import CategoriesMenu from './components/CategoriesMenu';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Adjust as per your config

const HomePage = () => {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadParentCategories = async () => {
      const categoriesData = await fetchCategoriesDashboard();
      setParentCategories(categoriesData);
    };
  
    loadParentCategories();
  }, []);
  
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/products?page=&category=${categoryId}`);
  };

  const promoImages = ['/carousel1.png', '/carousel2.png', '/carousel3.png'];

  return (
    <div className="text-center">
      {/* Promo Carousel */}
      <PromoCarousel images={promoImages} />
      <br/>

      {/* Categories Section */}
      <div>
        <h1 className="text-2xl font-bold my-2">Nuestros Productos</h1>
        <CategoriesMenu categories={parentCategories} onCategoryClick={handleCategoryClick} />
      </div>
    </div>
  );
};

export default HomePage;
