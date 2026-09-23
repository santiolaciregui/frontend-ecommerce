// components/CategoriesMenu.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CategoriesProps {
  categories: any[];
  onCategoryClick?: (categoryId: number) => void;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const CategoriesMenu: React.FC<CategoriesProps> = ({
  categories,
  onCategoryClick,
}) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: number) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    } else {
      // fallback
      router.push(`/products?category=${categoryId}`);
    }
  };

  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          onClick={() => handleCategoryClick(category.id)}
        >
          <h3 className="text-sm sm:text-base md:text-lg font-semibold">{category.name}</h3>
          <div className="relative w-full aspect-video mt-2 rounded-lg overflow-hidden">
            <Image
              src={
                category.previewImage
                  ? `${API_URL}${category.previewImage}`
                  : '/logo-verde-manzana-gris.svg'
              }
              alt={category.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesMenu;
