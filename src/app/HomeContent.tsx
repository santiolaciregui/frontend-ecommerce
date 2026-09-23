'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PromoCarousel from './components/PromoCarousel';
import { fetchCategoriesDashboard } from './pages/api/category';
import { fetchCarouselImages } from './pages/api/dashboard';
import CategoriesMenu from './components/CategoriesMenu';

export default function HomeContent({ carouselImages }: { carouselImages: string[] }) {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [images, setImages] = useState(carouselImages);
  useEffect(() => {
    fetchCategoriesDashboard().then(setParentCategories).catch((error) => console.error('Error fetching categories:', error));
  }, []);
  useEffect(() => {
    if (images.length === 0) {
      fetchCarouselImages().then(setImages).catch((error) => console.error('Error fetching carousel images:', error));
    }
  }, [images.length]);
  return <div className="text-center">
    {images.length > 0 ? <PromoCarousel images={images} /> : <div>Cargando imágenes...</div>}
    <br /><div><h1 className="text-2xl font-bold my-2">Nuestros Productos</h1>
      <CategoriesMenu categories={parentCategories} onCategoryClick={(id) => router.push(`/products?category=${id}`)} />
    </div>
  </div>;
}
