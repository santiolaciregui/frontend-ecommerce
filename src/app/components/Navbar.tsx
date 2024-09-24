'use client'
import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import NavIcons from "./NavIcons";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 800);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 z-20">
        {/* MOBILE */}
        <div className="h-full flex items-center justify-between md:hidden">
          {/* Asegúrate de que el Menu esté correctamente z-indexed y cubra todo */}
          <Menu />
          <Link href="/">
            <div className="flex items-center justify-center cursor-pointer">
              <Image src="/logo-verde-manzana.svg" alt="Logo" width={80} height={90} />
            </div>
          </Link>
          <div className="flex items-center">
            <NavIcons />
          </div>
        </div>
        {/* BIGGER SCREENS */}
        <div className="hidden md:flex items-center justify-between h-full">
          {/* LEFT */}
          <div className="w-1/3 flex items-center gap-4">
            <SearchBar />
          </div>
          {/* CENTER */}
          <div className="w-1/3 flex items-center justify-center">
            <Link href="/">
              <div
                className={`flex items-center gap-3 bg-transparent transition-transform duration-300 ${
                  isLargeScreen ? "transform scale-110" : "transform scale-90"
                }`}
              >
                <Image src="/logo-verde-manzana.svg" alt="Logo" width={80} height={80} />
              </div>
            </Link>
          </div>
          {/* RIGHT */}
          <div className="w-1/3 flex items-center justify-end gap-8">
            <NavIcons />
          </div>
        </div>
      </div>
      {/* Menu Links para pantallas grandes */}
      {isLargeScreen && (
        <div className="flex mt-4 mb-4 gap-12 justify-center">
          <div>
            <Link href="/">Inicio</Link>
          </div>
          <div className="cursor-pointer">
            <Link href="/products">Productos</Link>
          </div>
          <div className="cursor-pointer">
            <Link href="/empresa/contacto">Contacto</Link>
          </div>
          <div className="cursor-pointer">
            <Link href="/empresa/sobre-nosotros">Sobre Nosotros</Link>
          </div>
          <div className="cursor-pointer">
            <Link href="/admin">Administrar Pagina</Link>
          </div>
        </div>
      )}
    </div>
  );  
};


export default Navbar;
