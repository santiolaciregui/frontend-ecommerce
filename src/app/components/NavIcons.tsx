'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useCart } from '../context/CartContext';

const NavIcons = () => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { cart } = useCart();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/status`, { withCredentials: true });

      if (res.status === 200 && res.data.user) {
        // If user is authenticated, redirect to admin dashboard
        router.push('/admin');
      } else {
        // If user is not authenticated, redirect to login page
        router.push('/login');
      }
    } catch (error) {
      // In case of error (e.g., user not logged in), redirect to login page
      router.push('/login');
    }
  };

  const handleCartClick = () => {
    setProfileOpen(prev => !prev);
  };

  useEffect(() => {
    if (cart.length === 0 && isProfileOpen) {
      const timer = setTimeout(() => {
        setProfileOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [cart.length, isProfileOpen]);

  return (
    <div className='flex items-center justify-end gap-8 xl:gap-6 relative'>
      <Image
        src='/profile.png'
        alt='Profile'
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      <div className="relative cursor-pointer">
        <Image
          src='/cart.png'
          alt='Cart'
          width={22}
          height={22}
          className="cursor-pointer"
          onClick={handleCartClick}
        />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-green-500 rounded-full text-white text-sm flex items-center justify-center">
          {cart.length}
        </div>
      </div>
    </div>
  );
};

export default NavIcons;
