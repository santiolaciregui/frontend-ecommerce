// components/StoreCards.tsx
'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useFetchStores from '../hooks/useFetchStores';
import { whatsappUrl } from '../utils/whatsapp';
import { getImageUrl } from '../utils/getImageURL';
import { googleMapsUrl } from '../utils/googleMaps';
// If you use an icon similar to the Footer example, import it accordingly.
// import { MapPin } from 'lucide-react'; // or any other icon library

interface Store {
  id: number;
  imgSrc?: string;
  link?: string;
}

// Existing photos remain visible until an administrator uploads a replacement.
const staticStores: Store[] = [
  { id: 1, imgSrc: '/stores/Suarez.jpeg' },
  { id: 2, imgSrc: '/stores/Roca.jpeg' },
  { id: 3, imgSrc: '/stores/Lainez.jpeg' },
  { id: 4, imgSrc: '/stores/Centenario.jpeg' },
  { id: 5, imgSrc: '/stores/Alcorta.jpeg' },
];

const StoreCards: React.FC = () => {
  // Fetch the store data from your DB.
  const { stores: dbStores, error, loading } = useFetchStores();

  // While waiting for the data, you can render a loading indicator.
  if (loading) {
    return <p className="py-12 text-center text-zinc-500">Cargando sucursales...</p>;
  }
  if (error) {
    return <p role="status" className="py-12 text-center text-zinc-600">No pudimos cargar las sucursales. Intentá nuevamente más tarde.</p>;
  }

  // Merge each DB store with the static fallback data (matching by id).
  const mergedStores = dbStores.filter(store => store.isActive).map((store) => {
    const fallback = staticStores.find((s) => s.id === store.id);
    return {
      ...store,
      imgSrc: store.imageUrl ? getImageUrl(store.imageUrl) : fallback?.imgSrc,
      link: store.phone ? whatsappUrl(store.phone) : undefined,
    };
  });

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {mergedStores.map((store) => (
        <div
          key={store.id}
          className="block"
        >
          <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Fixed-size container (600x500 pixels) for the image */}
            {store.imgSrc && <div className="relative w-full aspect-[6/5]">
              <Image
                src={store.imgSrc!}
                alt={`Tienda ${store.id}`}
                fill
                unoptimized
                className="object-cover"
              />
            </div>}
            {/* Store details (address, city, state) */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                {/* Uncomment the icon import and component if desired */}
                {/* <MapPin className="w-4 h-4 text-gray-600" /> */}
                <a href={googleMapsUrl(store.address, store.city, store.state, store.googleMapsUrl)} target="_blank" rel="noopener noreferrer" className="text-gray-800 font-medium hover:underline">
                  {store.address} - {store.city}, {store.state}
                </a>
              </div>
              {store.phone && <a href={store.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-zinc-800 underline underline-offset-4">WhatsApp: {store.phone}</a>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreCards;
