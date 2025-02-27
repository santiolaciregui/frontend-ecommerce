'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '../utils/getImageURL';

interface PromoCarouselProps {
  images: string[];
  autoplay?: boolean;
  autoplayInterval?: number;
  maxHeight?: number; // Optional maximum height constraint
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({
  images,
  autoplay = true,
  autoplayInterval = 5000,
  maxHeight = 700 // Default maximum height
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(Array(images.length).fill(false));
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Function to handle previous slide
  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Function to handle next slide
  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Dynamically update dimensions based on window size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        // Get the container width
        const containerWidth = containerRef.current.clientWidth;
        
        // Calculate the appropriate height while maintaining aspect ratio
        // Using 16:9 as a default aspect ratio, but this can be adjusted
        // We also respect the maxHeight constraint
        const calculatedHeight = Math.min(containerWidth * 0.5625, maxHeight);
        
        setDimensions({
          width: containerWidth,
          height: calculatedHeight
        });
      }
    };

    // Initial calculation
    updateDimensions();
    
    // Recalculate on window resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [maxHeight]);

  // Autoplay for carousel
  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);
    
    return () => clearInterval(timer);
  }, [handleNext, autoplay, autoplayInterval]);

  // Touch gesture controls (swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNext();
    }
    
    if (isRightSwipe) {
      handlePrev();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handle image load state
  const handleImageLoad = (idx: number) => {
    const newLoadedState = [...isLoaded];
    newLoadedState[idx] = true;
    setIsLoaded(newLoadedState);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-full overflow-hidden px-1 xxs:px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6"
    >
      <div 
        className="relative w-full overflow-hidden rounded-lg shadow-md"
        style={{ height: `${dimensions.height}px` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Container for all slides */}
        <div 
          className="flex absolute left-0 top-0 h-full transition-transform duration-700 ease-in-out will-change-transform"
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
              {/* Loading placeholder */}
              {!isLoaded[idx] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <span className="sr-only">Loading image...</span>
                </div>
              )}
              
              <img
                src={getImageUrl(image)}
                alt={`Slide ${idx + 1}`}
                className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded[idx] ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => router.push('/products')}
                loading={idx === 0 || idx === currentSlide || idx === ((currentSlide + 1) % images.length) ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(idx)}
                sizes={`${dimensions.width}px`}
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons - Responsive size proportional to container */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
          style={{
            padding: `${Math.max(dimensions.width * 0.01, 8)}px`,
            fontSize: `${Math.max(dimensions.width * 0.015, 12)}px`
          }}
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          &#10094;
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
          style={{
            padding: `${Math.max(dimensions.width * 0.01, 8)}px`,
            fontSize: `${Math.max(dimensions.width * 0.015, 12)}px`
          }}
          onClick={handleNext}
          aria-label="Next slide"
        >
          &#10095;
        </button>

        {/* Slide indicators - Responsive size proportional to container */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              style={{
                width: `${Math.max(dimensions.width * 0.005, 6)}px`,
                height: `${Math.max(dimensions.width * 0.005, 6)}px`,
                margin: `0 ${Math.max(dimensions.width * 0.002, 4)}px`
              }}
              className={`rounded-full transition-colors ${
                currentSlide === idx ? 'bg-white' : 'bg-white/50'
              } focus:outline-none focus:ring-1 focus:ring-white`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={currentSlide === idx ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoCarousel;