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
    <div>
      <div className="h-[800px] relative">
        <Image
          src={getImageUrl(items[index]?.url)}
          alt={items[index]?.altText || 'Product Image'}
          fill
          sizes="50vw"
          className="object-contain rounded-sm"
          unoptimized
        />
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {items.map((item: ProductImage, i: number) => (
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
              className="object-contain rounded-sm"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
