'use client';

import { usePathname } from 'next/navigation';
import Alert from './Alert';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname()?.startsWith('/admin');

  return <>
    {!isAdmin && <Alert text='🚛 SHOPPING VM - LA FÁBRICA DE MUEBLES MÁS GRANDE DEL PAIS 🪑 💰' />}
    {!isAdmin && <Navbar />}
    <main className="flex-grow">{children}</main>
    {!isAdmin && <Footer />}
  </>;
}
