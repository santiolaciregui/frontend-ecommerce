// components/StoreCards.tsx
'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useFetchStores from '../hooks/useFetchStores';
// If you use an icon similar to the Footer example, import it accordingly.
// import { MapPin } from 'lucide-react'; // or any other icon library

interface Store {
  id: number;
  imgSrc?: string;
  link?: string;
  address?: string;
  city?: string;
  state?: string;
  // ... any other properties from your DB
}

// Fallback static images and links in case the DB store doesn't have them.
const staticStores: Store[] = [
  { id: 1, address: 'Sarmiento 275', imgSrc: '/stores/Suarez.jpeg', link: "https://api.whatsapp.com/send?phone=%2B542914128292" },
  { id: 2, address: 'Neuquen 1544', imgSrc: '/stores/Roca.jpeg', link: "https://api.whatsapp.com/send?phone=%2B542914128292" },
  { id: 3, address: 'Lainez 267', imgSrc: '/stores/Lainez.jpeg', link: "https://api.whatsapp.com/send?phone=%2B542914128292" },
  { id: 4, address: 'Perú 58', imgSrc: '/stores/Centenario.jpeg', link: "https://api.whatsapp.com/send?phone=%2B542914128292" },
  { id: 5, address: 'Amancio Alcorta 533', imgSrc: '/stores/Alcorta.jpeg', link: "https://api.whatsapp.com/send?phone=%2B542914128292" },
];

const StoreCards: React.FC = () => {
  // Fetch the store data from your DB.
  const { stores: dbStores } = useFetchStores();

  // While waiting for the data, you can render a loading indicator.
  if (!dbStores) {
    return <p>Loading stores...</p>;
  }

  // Merge each DB store with the static fallback data (matching by id).
  const mergedStores = dbStores.map((store) => {
    const fallback = staticStores.find((s) => s.address === store.address);
    return {
      ...store,
      imgSrc: fallback?.imgSrc,
      link: fallback?.link,
    };
  });

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {mergedStores.map((store) => (
        <Link
          key={store.id}
          href={store.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Fixed-size container (600x500 pixels) for the image */}
            <div className="relative w-[600px] h-[500px]">
              <Image
                src={store.imgSrc!}
                alt={`Tienda ${store.id}`}
                fill
                className="object-cover"
              />
            </div>
            {/* Store details (address, city, state) */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                {/* Uncomment the icon import and component if desired */}
                {/* <MapPin className="w-4 h-4 text-gray-600" /> */}
                <span className="text-gray-800 font-medium">
                  {store.address} - {store.city}, {store.state}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StoreCards;
