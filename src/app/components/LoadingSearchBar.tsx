import Image from 'next/image';

export default function LoadingSearchBar() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-pulse-slow">
        <Image 
          src="/logo-verde-manzana.svg" 
          alt="Loading" 
          width={40} 
          height={40} 
          className="transition-transform duration-300"
        />
      </div>
    </div>
  );
}