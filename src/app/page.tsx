'use client'
import { useRouter } from 'next/navigation';
import CategoriesMenu from './components/CategoriesMenu';
import PromoCarousel from './components/PromoCarousel';
import { useEffect, useState } from 'react';
import { fetchParentCategories } from './pages/api/category';

const HomePage = () => {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    const loadParentCategories = async () => {
      const categoriesData = await fetchParentCategories();
      setParentCategories(categoriesData);
    };
    loadParentCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?page=1&categoryId=${categoryId}`);
  };

  const promoImages = [
    '/carousel1.png',
    '/carousel2.png',
    '/carousel3.png',
  ];

  const categories = [
    { name: 'Sillas', image: '/silla1.png' },
    { name: 'Sillones', image: '/sillon.png' },
    // Add all other categories
  ];

  return (
    <div className="text-center">
      {/* Promo Carousel */}
      <PromoCarousel images={promoImages} />
      <div>
      <h1 className="text-2xl font-bold my-2">Nuestros Productos</h1>
      </div>
      {/* Categories Section */}
      <CategoriesMenu categories={categories} />
    </div>
  );
};

export default HomePage;
