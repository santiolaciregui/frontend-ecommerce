'use client';
import React from 'react';
import ClientReviews from '../components/ClientReviews';

const ReviewsPage = () => {
  return (
        <div className="py-8 px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">Clientes Felices</h1>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Descubre lo que nuestros clientes dicen sobre nuestros productos y servicios. 
            Nos enorgullece ofrecer la mejor experiencia de compra y atención al cliente.
          </p>
          
          <ClientReviews />
        </div>
      
  );
};

export default ReviewsPage;