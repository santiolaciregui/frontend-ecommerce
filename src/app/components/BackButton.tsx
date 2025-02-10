'use client';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  // Optional: if you want to navigate to a specific route instead of going back in history
  destination?: string;
}

const BackButton = ({ destination }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (destination) {
      // Navigate to a specific route
      router.push(destination);
    } else {
      // Go back to the previous page in the history
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
    >
      Volver
    </button>
  );
};

export default BackButton;
