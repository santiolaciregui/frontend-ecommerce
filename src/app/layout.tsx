import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Poppins as FontSans } from 'next/font/google'
import Alert from "./components/Alert";
import { UserProvider } from './context/UserContext';
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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Alert text='SHOPPING VM - FABRICA DE MUEBLES - GIGANTE DEL AHORRO' />
        <CartProvider>
          <UserProvider>
            <Navbar />
            <main className="flex-grow">
              {children}

            </main>
            <Footer/>
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}