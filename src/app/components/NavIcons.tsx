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
    if (cart.length === 0 && isCartOpen) {
      const timer = setTimeout(() => {
        setCartOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [cart.length, isCartOpen]);

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading state while checking authentication
  }

  return (
    <div className='flex items-center justify-end gap-8 xl:gap-6 relative'>
      <Image
        src='/profile.png'
        alt='Profile'
        width={22}
        height={22}
        className='cursor-pointer'
        onClick={handleProfileClick}
      />
      {isAuthenticated && isProfileOpen && (
        <div className='absolute p-4 rounded-md top-12 w-32 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20'>
          <Link href='/profile'>Perfil</Link>
          <div className='mt-2 cursor-pointer' onClick={handleLogout}>
            Cerrar Sesion
          </div>
        </div>
      )}
      <div className='relative cursor-pointer'>
        <Image
          src='/cart.png'
          alt='Cart'
          width={22}
          height={22}
          className='cursor-pointer'
          onClick={handleCartClick}
        />
        <div className='absolute -top-4 -right-4 w-6 h-6 bg-green-500 rounded-full text-white text-sm flex items-center justify-center'>
          {cart.length}
        </div>
      </div>
      <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default NavIcons;
