import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";
import { Poppins as FontSans } from 'next/font/google'
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Verde Manzana Store",
  icons: {
    icon: '/logo-verde-manzana-gris.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <CartProvider>
          <UserProvider>
            <SiteChrome>{children}</SiteChrome>
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}
