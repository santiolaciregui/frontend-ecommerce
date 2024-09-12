import Image from 'next/image';

export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center justify-center">
        <div className="animate-pulse-slow">
          <Image 
            src="/logo-verde-manzana.svg" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}
