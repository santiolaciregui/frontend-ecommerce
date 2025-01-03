'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PromoCarousel from './components/PromoCarousel';
import { fetchCategories } from './pages/api/category';
import ProductImages from './components/ProductImages';
import { Category } from './context/types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Ajusta según tu configuración

const HomePage = () => {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadParentCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        const enrichedCategories = await Promise.all(
          categoriesData.map(async (category: Category) => {
            const res = await fetch(`${API_URL}/products/category/${category.id}`);
            const products = await res.json();
            const images = products[0]?.Images || []; // Todas las imágenes del primer producto
            return {
              ...category,
              images,
            };
          })
        );
  
        // Filtrar categorías que no tengan imágenes
        const filteredCategories = enrichedCategories.filter(
          (category) => category.images.length > 0
        );
  
        setParentCategories(filteredCategories as Category[]);
      } catch (error) {
        console.error('Error fetching categories or products:', error);
      }
    };
  
    loadParentCategories();
  }, []);
  
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/products?page=1&categoryId=${categoryId}`);
  };

  const promoImages = ['/carousel1.png', '/carousel2.png', '/carousel3.png'];

  return (
    <div className="text-center">
      {/* Promo Carousel */}
      <PromoCarousel images={promoImages} />

      {/* Categories Section */}
      <div>
        <h1 className="text-2xl font-bold my-2">Nuestros Productos</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {parentCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative cursor-pointer rounded-md overflow-hidden"
            >
              {/* Usando el componente ProductImages */}
              <ProductImages items={[category]} />

              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-sm px-2 py-1">
                {category.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
