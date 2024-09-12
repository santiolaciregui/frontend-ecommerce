'use client'
import React, { useState } from 'react';
import Image from 'next/image';

interface Zone {
  id: number;
  imgSrc: string;
  link: string;
}

const zones: Zone[] = [
  { id: 1, imgSrc: '/zona-1.png', link: 'https://wa.link/a4h9qa' },
  { id: 2, imgSrc: '/zona-2.png', link: 'https://wa.link/a4h9qa' },
  { id: 3, imgSrc: '/zona-3.png', link: 'https://wa.link/a4h9qa' },
  { id: 4, imgSrc: '/zona-4.png', link: 'https://wa.link/a4h9qa' },
  { id: 5, imgSrc: '/zona-5.png', link: 'https://wa.link/a4h9qa' },
  // Add the rest of the zones here
];

const Carousel: React.FC = () => {
  const [currentZone, setCurrentZone] = useState<number>(0);

  const nextZone = () => {
    setCurrentZone((prev) => (prev + 1) % zones.length);
  };

  const prevZone = () => {
    setCurrentZone((prev) => (prev - 1 + zones.length) % zones.length);
  };

  return (
    <div className="max-w-6xl mx-auto">
    <div className="relative w-full">
      <a href={zones[currentZone].link} target="_blank" rel="noopener noreferrer">
        <Image src={zones[currentZone].imgSrc} width={800} height={600} alt={`Zona ${zones[currentZone].id}`} className="w-full" />
      </a>
      <button onClick={prevZone} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-green-800">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button onClick={nextZone} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-green-800">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    </div>
  );
}

export default Carousel;