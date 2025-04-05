import React from 'react';
import { useRouter } from 'next/navigation';

interface CategoriesProps {
  categories: any[];
  onCategoryClick?: (categoryId: number) => void;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const CategoriesMenu: React.FC<CategoriesProps> = ({ categories, onCategoryClick }) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: number) => {
    if (onCategoryClick) {
      // Use the provided callback if it exists
      onCategoryClick(categoryId);
    } else {
      // Make sure we're using the correct format for the URL
      console.log(`Navigating to category: ${categoryId}`);
      router.push(`/products?category=${categoryId}`);
    }
  };

  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories && categories.map((category) => (
        <div
          key={category.id}
          className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          onClick={() => handleCategoryClick(category.id)}
        >
          <h3 className="text-sm sm:text-base md:text-lg font-semibold">{category.name}</h3>
          <div className="w-full aspect-w-16 aspect-h-9 mt-2 rounded-lg overflow-hidden">
            <img
              src={
                category.previewImage
                  ? `${API_URL}${category.previewImage}`
                  : '/logo-verde-manzana.svg'
              }
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesMenu;
