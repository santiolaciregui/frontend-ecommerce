import Image from 'next/image';
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        <div className="w-20">
          <Image src="/logo-verde-manzana.svg" width={80} height={80} alt="Logo" />
        </div>
        <div className="space-x-8">
          <a href="https://www.facebook.com/VERDEMANZANAMUEBLESARGENTINA" target="_blank" rel="noopener noreferrer">
            <Image src="/facebook.png" width={32} height={32} alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/mueblesverdemanzana/?hl=es-la" target="_blank" rel="noopener noreferrer">
            <Image src="/instagram.png" width={32} height={32} alt="Instagram" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;