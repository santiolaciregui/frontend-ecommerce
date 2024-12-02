import Image from 'next/image';
import { useState } from 'react';

const ProductImages = ({ items }: { items: any[] }) => {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  const [index, setIndex] = useState(0);

  // Función para construir la URL de forma segura
  const getImageUrl = (path: string) => {
    if (!path) return '/default-image.png'; // Imagen por defecto
    try {
      return new URL(path, API_URL).toString(); // Combina la URL base y el path
    } catch (error) {
      console.error('Error constructing URL:', error);
      return '/default-image.png'; // Imagen por defecto en caso de error
    }
  };

  return (
    <div>
      <div className="h-[500px] relative">
        <Image
          src={getImageUrl(items[index]?.url)}
          alt={items[index]?.altText || 'Product Image'}
          fill
          sizes="50vw"
          className="object-cover rounded-sm"
          unoptimized
        />
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {items.map((item: any, i: number) => (
          <div
            className="w-1/4 h-32 relative cursor-pointer"
            key={item.id}
            onClick={() => setIndex(i)}
          >
            <Image
              src={getImageUrl(item.url)}
              alt={item.altText || 'Product Thumbnail'}
              fill
              sizes="30vw"
              className="object-cover rounded-sm"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
