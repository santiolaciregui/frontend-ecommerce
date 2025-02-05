import Image from 'next/image';
import { useState } from 'react';
import { getImageUrl } from '../utils/getImageURL';

const ProductImages = ({ items }: { items: any[] }) => {
  const [index, setIndex] = useState(0);

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
