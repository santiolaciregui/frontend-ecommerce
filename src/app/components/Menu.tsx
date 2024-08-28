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
        <div className=''>
            <Image 
                src='/menu.png' 
                alt='' 
                width={28}
                height={28}
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)} 
            />
            <div 
                className={`fixed bg-white text-black left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10 transition-opacity duration-300 ease-in-out ${
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                <Link href='/products' onClick={handleLinkClick}>Productos</Link>
                <Link href="/company" onClick={handleLinkClick}>Contacto</Link>
                <Link href="/como-comprar" onClick={handleLinkClick}>¿Como comprar?</Link>
                <Link href="/admin" onClick={handleLinkClick}>Administrar Pagina</Link>
            </div>
        </div>
    )
}

export default Menu