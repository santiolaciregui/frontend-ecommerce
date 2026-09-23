'use client';
import { Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import useFetchStores from '../hooks/useFetchStores';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { whatsappUrl } from '../utils/whatsapp';

const Footer = () => {
  const { stores } = useFetchStores();
  const settings = useSiteSettings();

  return (
    <footer className="bg-gray-100 text-sm mt-10 py-8 px-6 md:px-12 lg:px-16 xl:px-32">
      {/* TOP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 justify-items-center">
        {/* LEFT SECTION */}
        <div className="lg:col-span-1 ">
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="text-2xl font-bold tracking-wide text-gray-800 hover:text-gray-600">
              VERDE MANZANA
            </Link>
            <div className="mt-4 space-y-2">
              {stores.filter(store => store.isActive).map((store) => (
                <div key={store.id} className="space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-600 shrink-0" />
                    <span>{store.address} - {store.city}, {store.state}</span>
                  </div>
                  {store.phone && <a href={whatsappUrl(store.phone)} target="_blank" rel="noopener noreferrer" className="ml-6 flex items-center gap-2 text-zinc-700 hover:underline"><Phone className="w-4 h-4" />{store.phone}</a>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="lg:col-span-1 ">
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="text-lg font-semibold text-gray-800">ENLACES</h2>
            <nav className="mt-4 flex flex-col items-center lg:items-start space-y-3">
              <Link href="/empresa/sobre-nosotros" className="text-gray-600 hover:text-gray-800">
                Sobre Nosotros
              </Link>
              <Link href="/reviews" className="text-gray-600 hover:text-gray-800">
              Clientes Felices
              </Link>
              <Link href="/empresa/contacto" className="text-gray-600 hover:text-gray-800">
                Contáctanos
              </Link>
              <Link href="/terminos_condiciones" className="text-gray-600 hover:text-gray-800">
                Términos y Condiciones
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-800">
                Administración
              </Link>
            </nav>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-1 ">
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="text-lg font-semibold text-gray-800">ENCONTRANOS EN</h2>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://www.facebook.com/VERDEMANZANAMUEBLESARGENTINA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                <Facebook className="w-6 h-6" aria-label="Facebook" />
              </a>
              {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-600 hover:text-gray-800"><Instagram className="w-6 h-6" /></a>}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">MÉTODOS DE PAGO</h2>
              <div className="flex items-center gap-4 mt-2">
                <Image src="/Visa.png" alt="Visa" width={40} height={20} />
                <Image src="/Mastercard.png" alt="Mastercard" width={40} height={20} />
                <Image src="/Cabal.png" alt="Cabal" width={40} height={20} />
                <Image src="/American Express.png" alt="AmericanExpress" width={40} height={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t mt-10 pt-4 text-center text-gray-500">
        <span>© {new Date().getFullYear()} Verde Manzana. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
};

export default Footer;
