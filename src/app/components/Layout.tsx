import Head from 'next/head';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cover bg-center py-10 font-montserrat text-green-700" style={{backgroundImage: "url('/bg.png')"}}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Verde Manzana</title>
        <meta name="description" content="Empresa líder en el mercado regional de muebles ofreciendo calidad e innovación, reconocidos por nuestra vocación. Y si lo que estas buscando son los mejores precios, VM te los garantiza. Así como también entregas a tiempo con responsabilidad." />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>
      {children}
    </div>
  );
}

export default Layout;