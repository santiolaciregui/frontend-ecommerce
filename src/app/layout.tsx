import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Poppins as FontSans } from 'next/font/google'
import Alert from "./components/Alert";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { CartProvider } from './context/CartContext';





const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Verde Manzana Store",
  //description: "A complete e-commerce application with Next.js and Wix",
  icons: {
    icon: '/logo-verde-manzana.svg',
  },
};

const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">

      <body className={inter.className}>
        
        <div>
          <Alert text='OFERTAS -  12 cuotas sin interes - 12 cuotas sin interés | 12% descuento con transferencia | GoCuotas 5% de descuento' />
          <CartProvider>
          <UserProvider>
          
            <Navbar />
            {children}
            <Footer/>
            
          </UserProvider>
          </CartProvider>
          </div>
      </body>
    </html>

  );
}
