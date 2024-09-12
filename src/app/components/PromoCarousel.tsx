'use client'
// components/PromoCarousel.tsx
import { useState } from 'react';

interface PromoCarouselProps {
  images: string[];
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <div
        className="flex transition-transform ease-in-out duration-700"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0">
            <img
              src={image}
              alt={`Slide ${idx}`}
              className="w-full h-full object-cover" // Aseguramos que cubra el contenedor sin distorsionar
            />
          </div>
        ))}
      </div>

      {/* Botones */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 hover:bg-opacity-75 transition"
        onClick={handlePrev}
      >
        &#10094;
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 hover:bg-opacity-75 transition"
        onClick={handleNext}
      >
        &#10095;
      </button>
    </div>
  );
};

export default PromoCarousel;
