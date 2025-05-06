import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/getImageURL';

interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  ProductImage: {
    id: number;
    productId: number;
    imageId: number;
    colorId: number | null;
  };
}

interface ProductImagesProps {
  items: ProductImage[];
  selectedColorId?: number | null;
}

const ProductImages = ({ items, selectedColorId }: ProductImagesProps) => {
  const [index, setIndex] = useState(0);

  // When selectedColorId changes, find the matching image and update the index
  useEffect(() => {
    if (selectedColorId) {
      const colorImageIndex = items.findIndex(
        item => item.ProductImage?.colorId === selectedColorId
      );
      
      if (colorImageIndex !== -1) {
        setIndex(colorImageIndex);
      }
    }
  }, [selectedColorId, items]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[400px] md:h-[550px] lg:h-[700px] w-full">
        <Image
          src={getImageUrl(items[index]?.url)}
          alt={items[index]?.altText || 'Product Image'}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain rounded-sm"
          unoptimized
        />
      </div>
      <div className="flex justify-between gap-2 md:gap-4">
        {items.map((item: ProductImage, i: number) => (
          <div
            className="w-1/4 h-20 md:h-24 lg:h-32 relative cursor-pointer border rounded-sm"
            key={item.id}
            onClick={() => setIndex(i)}
          >
            <Image
              src={getImageUrl(item.url)}
              alt={item.altText || 'Product Thumbnail'}
              fill
              sizes="(max-width: 768px) 25vw, 15vw"
              className="object-contain p-1"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;