'use client'
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const Menu = () => {

    const [open, setOpen] = useState(false)
    return (
        <div className=''>
            <Image 
                src='/menu.png' 
                alt='' 
                width={28}
                height={28}
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)} 
            />{
                open && 
                <div className="absolute bg-white text-black left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10">
                    <Link href='/products'>Productos</Link>
                    <Link href="/company">Contacto</Link>
                    <Link href="/como-comprar">¿Como comprar?</Link>
                    <Link href="/admin">Administrar Pagina</Link>

                </div>
            }
        </div>
    )
}

export default Menu