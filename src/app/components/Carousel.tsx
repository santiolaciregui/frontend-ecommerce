'use client'
import { useState } from 'react';

const slides = [
  {
    title: 'ZONA 2',
    locations: [
      'Bahía Blanca (Bs.As)',
      'Coronel Dorrego (Bs.As)',
      'Coronel Pringles (Bs.As)',
      'Monte Hermoso (Bs.As)',
      'Punta Alta (Bs.As)',
      'Saavedra (Bs.As)',
      'Saldungaray (Bs.As)',
      'Sierra De La Ventana (Bs.As)',
      'Tornquist (Bs.As)',
    ],
    phone: '2926464895',
  },
  // Add more slides as needed
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-lime-500 flex flex-col items-center justify-center min-h-dvh p-2">
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl mb-4">Estamos en tu zona</h1>
        <p className="mb-8">Buscá tu localidad y contactate con un asesor</p>
      </div>
      <div className="relative w-full max-w-4xl">
        <div className="overflow-hidden rounded-lg shadow-lg bg-white p-6">
          <h2 className="text-2xl font-bold text-center text-lime-500 mb-4">
            {slides[currentIndex].title}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {slides[currentIndex].locations.map((location, index) => (
              <div key={index} className="text-center">
                <p>{location}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <a
              href={`tel:${slides[currentIndex].phone}`}
              className="block bg-green-500 text-white py-2 px-4 rounded"
            >
              📞 {slides[currentIndex].phone}
            </a>
          </div>
        </div>
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-lime-600 text-white rounded-full shadow-md focus:outline-none"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-lime-600 text-white rounded-full shadow-md focus:outline-none"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Carousel;
