'use client';
import { Facebook, Instagram, MapPin, Phone, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import useFetchStores from '../hooks/useFetchStores';
import { whatsappUrl } from '../utils/whatsapp';
import { googleMapsUrl } from '../utils/googleMaps';

const Footer = () => {
  const { stores } = useFetchStores();
  const instagramDialogRef = useRef<HTMLDialogElement>(null);

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
                    <a href={googleMapsUrl(store.address, store.city, store.state)} target="_blank" rel="noopener noreferrer" className="hover:underline">{store.address} - {store.city}, {store.state}</a>
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
              <button
                type="button"
                onClick={() => instagramDialogRef.current?.showModal()}
                aria-label="Elegir cuenta de Instagram"
                className="text-gray-600 hover:text-gray-800"
              >
                <Instagram className="w-6 h-6" aria-hidden="true" />
              </button>
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

      <dialog
        ref={instagramDialogRef}
        aria-labelledby="instagram-dialog-title"
        className="w-[calc(100%-2rem)] max-w-sm rounded-xl bg-white p-6 text-gray-800 shadow-xl backdrop:bg-black/50"
        onClick={(event) => {
          if (event.target === event.currentTarget) instagramDialogRef.current?.close();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="instagram-dialog-title" className="text-lg font-semibold">Elegí una cuenta de Instagram</h2>
            <p className="mt-1 text-sm text-gray-600">Seleccioná la sede que querés visitar.</p>
          </div>
          <form method="dialog">
            <button type="submit" aria-label="Cerrar" className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="https://www.instagram.com/fabricavm.bahia.suarez?stkn=MWt4dHk2aG5jYmtneA=="
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => instagramDialogRef.current?.close()}
            className="rounded-lg border border-gray-300 px-4 py-3 text-center font-medium hover:border-gray-800 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
          >
            Neuquén
          </a>
          <a
            href="https://www.instagram.com/fabrica_vm?stkn=ZnltaW9xeTcyMXoy"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => instagramDialogRef.current?.close()}
            className="rounded-lg border border-gray-300 px-4 py-3 text-center font-medium hover:border-gray-800 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
          >
            Bahía Blanca - Coronel Suárez
          </a>
        </div>
      </dialog>
    </footer>
  );
};

export default Footer;
