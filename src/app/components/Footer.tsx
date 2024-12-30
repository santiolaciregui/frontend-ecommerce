'use client';
import { Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import useFetchStores from '../hooks/useFetchStores';

const Footer = () => {
  const { stores } = useFetchStores();

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
              {stores.map((store) => (
                <div key={store.id} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span>{store.address} - {store.city}, {store.state}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600" />
              <a
                href="https://api.whatsapp.com/send?phone=%2B542914128292"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 font-medium hover:underline"
              >
                +54 0291 412-8292
              </a>
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
              <Link href="/empresa/contacto" className="text-gray-600 hover:text-gray-800">
                Contáctanos
              </Link>
            </nav>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-1 ">
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="text-lg font-semibold text-gray-800">SEGUINOS</h2>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://www.facebook.com/VERDEMANZANAMUEBLESARGENTINA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/mueblesverdemanzana/?hl=es-la"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">MÉTODOS DE PAGO</h2>
              <div className="flex items-center gap-4 mt-2">
                <Image src="/visa.png" alt="Visa" width={40} height={20} />
                <Image src="/mastercard.png" alt="Mastercard" width={40} height={20} />
                <Image src="/cabal.png" alt="Cabal" width={40} height={20} />
                <Image src="/American Express.png" alt="AmericanExpress" width={40} height={20} />
                <Image src="/NaranjaX.png" alt="NaranjaX" width={40} height={20} />

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