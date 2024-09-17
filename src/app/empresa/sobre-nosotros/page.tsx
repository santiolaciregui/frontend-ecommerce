import React from 'react';
import { NextPage } from 'next';
import Layout from '@/app/components/Layout';
import Header from '@/app/components/Header';

const Home: NextPage = () => {
  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 mt-8">

        {/* Sección de Sobre Nosotros */}
        <section className=" py-12 px-6 rounded-lg  mt-12">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-6">
            Sobre Nosotros
          </h2>
          <p className="text-lg md:text-xl text-center text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Empresa líder en el mercado regional de muebles ofreciendo calidad e innovación, 
            reconocidos por nuestra vocación. Y si lo que estás buscando son los mejores 
            precios, <span className="font-semibold text-gray-800">VM</span> te los garantiza. 
            Así como también entregas a tiempo con responsabilidad.
          </p>
        </section>

      </main>
    </Layout>
  );
};

export default Home;
