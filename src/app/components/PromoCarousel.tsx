'use client'
import React, { useState, useCallback } from 'react';

interface PromoCarouselProps {
  images: string[];
  height?: string;
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({ 
  images, 
  height = "h-[500px]" // Default height if not provided
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        return images.length - 1;
      }
      return prev - 1;
    });
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev === images.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  }, [images.length]);

  return (
    <div className={`relative w-full ${height} max-w-full overflow-hidden `}>
      {/* Container for all slides */}
      <div 
        className="flex absolute left-0 top-0 h-full transition-transform duration-700 ease-in-out"
        style={{ 
          width: `${100 * images.length}%`,
          transform: `translateX(-${(currentSlide * 100) / images.length}%)`
        }}
      >
        {images.map((image, idx) => (
          <div 
            key={idx} 
            className="relative flex items-center justify-center h-full"
            style={{ width: `${100 / images.length}%` }}
          >
            <div className="w-full h-full relative">
              <img
                src={image || "/api/placeholder/800/500"}
                alt={`Slide ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-4 rounded-full transition-colors z-10"
        onClick={handlePrev}
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-4 rounded-full transition-colors z-10"
        onClick={handleNext}
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === idx ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;