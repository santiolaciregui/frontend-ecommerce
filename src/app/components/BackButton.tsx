'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  destination?: string;
}

const BackButton = ({ destination }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (destination) {
      router.push(destination);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-black transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <ArrowLeft size={18} />
      <span className="text-sm font-medium">Atrás</span>
    </button>
  );
};

export default BackButton;
