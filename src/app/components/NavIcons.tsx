'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import Link from 'next/link';
import useAuth from '../hooks/useAuth'; // Import the useAuth hook

const NavIcons = () => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth(); // Use the custom useAuth hook
  const router = useRouter();
  const { cart } = useCart();

  const handleProfileClick = () => {
    setProfileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  const handleCartClick = () => {
    setCartOpen((prev) => !prev);
  };

  useEffect(() => {
    if (cart === null && isCartOpen) {
      const timer = setTimeout(() => {
        setCartOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [cart, isCartOpen]);

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading state while checking authentication
  }

  return (
    <div className='flex items-center justify-end gap-8 xl:gap-6 relative'>
      <div className='relative cursor-pointer mr-2'>
        <Image
          src='/cart.png'
          alt='Cart'
          width={22}
          height={22}
          className='cursor-pointer'
          onClick={handleCartClick}
        />
        <div className='absolute -top-4 -right-4 w-6 h-6 bg-green-500 rounded-full text-white text-sm flex items-center justify-center'>
          {cart?.length || 0}
        </div>
      </div>
      <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default NavIcons;
