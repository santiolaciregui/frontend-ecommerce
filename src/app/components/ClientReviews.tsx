'use client';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFlip } from 'swiper/modules';
import { getImageUrl } from '../utils/getImageURL';
import { fetchReviewImages } from '../pages/api/reviews';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';

// Sample review data - in a real app, this could come from your backend
const sampleReviews = [
  { image: '' },
  { image: '' },
  { image: '' },
  { image: '' },
  { image: '' }
];

const ClientReviews: React.FC = () => {
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadReviewImages = async () => {
      try {
        setLoading(true);
        const images = await fetchReviewImages();
        setReviewImages(images);
      } catch (error) {
        console.error('Error loading review images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviewImages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFlip]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        effect={'flip'}
        flipEffect={{ slideShadows: false }}
        pagination={{ 
          clickable: true,
          el: '.swiper-pagination',
          type: 'bullets',
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
        }}
        className="review-swiper"
      >
        {reviewImages.length > 0 ? (
          reviewImages.map((imageUrl, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-lg p-6 h-full flex items-center justify-center">
                <div className="w-full h-[500px] mx-auto overflow-hidden rounded-lg">
                  <img 
                    src={getImageUrl(imageUrl)} 
                    alt="Client Review" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          // Fallback to sample placeholders if no images are available
          sampleReviews.map((_, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-lg p-6 h-full flex items-center justify-center">
                <div className="w-full h-[500px] mx-auto overflow-hidden rounded-lg">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">Image placeholder</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
      
      {/* Pagination dots container */}
      <div className="swiper-pagination mt-4 flex justify-center"></div>

      {/* Custom styles for Swiper */}
      <style jsx global>{`
        .review-swiper {
          padding: 20px 10px 40px;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #4a5568;
        }
        .swiper-pagination-bullet-active {
          background: #4a5568;
        }
        .swiper-pagination {
          position: relative;
          bottom: 0;
          margin-top: 15px;
        }
        .swiper-pagination-bullet {
          margin: 0 4px;
        }
        .swiper-slide {
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .swiper-slide img {
          transition: transform 0.3s ease;
          max-height: 500px;
          width: auto;
        }
      `}</style>
    </div>
  );
};

export default ClientReviews;