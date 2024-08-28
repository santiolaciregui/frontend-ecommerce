'use client'

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CartModal from "./CartModal";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useCart } from "../context/CartContext";

const NavIcons = () => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isCartOpen, setCartOpen] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    const { cart } = useCart();

    const handleProfile = () => {
        if (!user) {
            router.push('/api/auth/login');
        } else {
            setProfileOpen(prev => !prev);
        }
    };

    const handleCartClick = () => {
        setCartOpen(prev => !prev);
    };

    useEffect(() => {
        if (cart.length === 0 && isCartOpen) {
            const timer = setTimeout(() => {
                setCartOpen(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [cart.length, isCartOpen]);

    return (
        <div className='flex items-center justify-end gap-8 xl:gap-6 relative'>
            <Image
                src='/profile.png'
                alt=''
                width={22}
                height={22}
                className="cursor-pointer"
                onClick={handleProfile}
            />
            {user && isProfileOpen &&
                <div className='absolute p-4 rounded-md top-12 w-32 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20'>
                    <Link href='/api/auth/login'>Perfil</Link>
                    <div className='mt-2 cursor-pointer'>
                        <Link href='/api/auth/logout'>Cerrar Sesion</Link>
                    </div>
                </div>
            }
            <div className="relative cursor-pointer">
                <Image
                    src='/cart.png'
                    alt=''
                    width={22}
                    height={22}
                    className="cursor-pointer"
                    onClick={handleCartClick}
                />
                <div className="absolute -top-4 -right-4 w-6 h-6 bg-green-500 rounded-full text-white text-sm flex items-center justify-center">{cart.length}</div>
            </div>
            <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
        </div>
    );
};

export default NavIcons;
