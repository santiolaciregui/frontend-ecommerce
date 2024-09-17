import React from 'react';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import Carousel from '../../components/Carousel';
import Branches from '../../components/Branches';
import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 mt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Estamos en tu zona</h1>
          <p className="text-xl md:text-3xl">Buscá tu localidad y contactate con un asesor</p>
        </div>
        <Carousel />
        <Branches />
      </main>
    </Layout>
  );
}

export default Home;