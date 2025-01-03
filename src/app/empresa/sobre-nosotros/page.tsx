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
<section className="py-12 px-6 rounded-lg mt-12">
  <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-6">
    Sobre Nosotros
  </h2>
  <p className="text-lg md:text-xl text-center text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6">
    Verde Manzana - Fábrica VM<br />
  </p>
  <div className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Sucursales:</h3>
    <ul className="list-disc list-inside">
      <li>Ciudad de Neuquén: Lainez 267</li>
      <li>Ciudad de Neuquén: Alcorta 533</li>
      <li>Coronel Suárez, Buenos Aires: Sarmiento 275</li>
      <li>General Roca, Río Negro: Neuquén 1.544</li>
      <li>Centenario, Neuquén: Perú 58</li>
    </ul>
  </div>
  <div className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Nuestros valores:</h3>
    <p>
      Fábrica VM es una empresa que nació de la ilusión de una familia con amplia trayectoria comercial que supo instalarse en la Patagonia con identidad propia. Busca constantemente guiar el funcionamiento de la marca con principios éticos y morales que caracterizan a la familia. Sus principales valores son honestidad y transparencia.
    </p>
  </div>
  <div className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Misión:</h3>
    <p>
      El objetivo inicial y constante de la empresa es traer a la Patagonia materia prima de calidad, mano de obra experimentada y, sobre todo, precios justos y competitivos en mobiliarios de diversas calidades y estilos. Además, Fábrica VM ofrece a los clientes una excelente plataforma humana y familiar para brindar seguridad y confianza en sus compras.
    </p>
  </div>
  <div className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Visión:</h3>
    <p>
      La visión de la marca es ser una empresa con proyección nacional. Esto será posible mediante el esfuerzo, dedicación y profesionalismo de su equipo de trabajo, tomando en cuenta las tendencias del mercado y las necesidades actuales y futuras de sus clientes. Fábrica VM se esfuerza por seguir renovándose y actualizándose para llegar a ser la mejor opción nacional en venta de muebles.
    </p>
  </div>
</section>


      </main>
    </Layout>
  );
};

export default Home;
