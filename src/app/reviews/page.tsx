'use client';
import React from 'react';
import ClientReviews from '../components/ClientReviews';
import { useSiteSettings } from '../hooks/useSiteSettings';

const ReviewsPage = () => {
  const settings = useSiteSettings();
  return (
        <div className="py-8 px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">Clientes Felices</h1>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Descubre lo que nuestros clientes dicen sobre nuestros productos y servicios. 
            Nos enorgullece ofrecer la mejor experiencia de compra y atención al cliente.
          </p>
          {settings.googleReviewsUrl && <div className="text-center mb-8"><a href={settings.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-zinc-900 px-5 py-3 text-white hover:bg-zinc-700">Ver opiniones en Google</a></div>}
          
          <ClientReviews />
        </div>
      
  );
};

export default ReviewsPage;
