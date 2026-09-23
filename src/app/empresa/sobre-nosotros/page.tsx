'use client';
import React from 'react';
import { NextPage } from 'next';
import Layout from '@/app/components/Layout';
import Header from '@/app/components/Header';
import useFetchStores from '@/app/hooks/useFetchStores';
import { googleMapsUrl } from '@/app/utils/googleMaps';

const Home: NextPage = () => {
  const { stores } = useFetchStores();
  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-8 mt-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Sobre Nosotros</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <section>
              <p className="text-gray-700 text-center font-semibold text-lg">
                Verde Manzana - Fábrica VM
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Sucursales:</h2>
              <ul className="list-disc pl-6 text-gray-700">
                {stores.filter(store => store.isActive).map(store => <li key={store.id}><a href={googleMapsUrl(store.address, store.city, store.state)} target="_blank" rel="noopener noreferrer" className="hover:underline">{store.city}, {store.state}: {store.address}</a></li>)}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Nuestros valores:</h2>
              <p className="text-gray-700">
                Fábrica VM es una empresa que nació de la ilusión de una familia con amplia trayectoria comercial que supo instalarse en la Patagonia con identidad propia. Busca constantemente guiar el funcionamiento de la marca con principios éticos y morales que caracterizan a la familia. Sus principales valores son honestidad y transparencia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Misión:</h2>
              <p className="text-gray-700">
                El objetivo inicial y constante de la empresa es traer a la Patagonia materia prima de calidad, mano de obra experimentada y, sobre todo, precios justos y competitivos en mobiliarios de diversas calidades y estilos. Además, Fábrica VM ofrece a los clientes una excelente plataforma humana y familiar para brindar seguridad y confianza en sus compras.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Visión:</h2>
              <p className="text-gray-700">
                La visión de la marca es ser una empresa con proyección nacional. Esto será posible mediante el esfuerzo, dedicación y profesionalismo de su equipo de trabajo, tomando en cuenta las tendencias del mercado y las necesidades actuales y futuras de sus clientes. Fábrica VM se esfuerza por seguir renovándose y actualizándose para llegar a ser la mejor opción nacional en venta de muebles.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center text-gray-600 italic">
            <p>¡Gracias por elegir Fábrica VM!</p>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
