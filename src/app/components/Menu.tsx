'use client'
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

const Menu = () => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleRouteChange = () => {
            setOpen(false)
        }

        window.addEventListener('popstate', handleRouteChange)

        return () => {
            window.removeEventListener('popstate', handleRouteChange)
        }
    }, [])

    const handleLinkClick = () => {
        setOpen(false)
    }

    return (
        <div className='relative'>
            {/* Botón de menú en el navbar */}
            <Image 
                src='/menu.png' 
                alt='Abrir menú' 
                width={28}
                height={28}
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)} 
            />

            {/* Sidebar */}
            <div 
                className={`fixed bg-white text-black left-0 top-0 w-full h-full flex flex-col items-center justify-center gap-8 text-xl z-50 transition-transform duration-300 ease-in-out ${
                    open ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
                }`}
            >
                {/* Botón de cerrar */}
                <button 
    className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-transparent border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 hover:border-gray-500 hover:text-gray-900 transition-all"
    onClick={() => setOpen(false)}
>
    <span className="text-2xl font-semibold">&times;</span>
</button>


                {/* Enlaces del menú */}
                <Link href='/products' onClick={handleLinkClick}>Productos</Link>
                <Link href="/empresa/contacto" onClick={handleLinkClick}>Contacto</Link>
                <Link href="/empresa/sobre-nosotros" onClick={handleLinkClick}>Sobre Nosotros</Link>
                <Link href="/admin" onClick={handleLinkClick}>Administrar Página</Link>
            </div>
        </div>
    )
}

export default Menu
