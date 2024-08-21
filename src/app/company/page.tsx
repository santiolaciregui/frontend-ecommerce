// pages/index.js
import Head from 'next/head';
import Carousel from '../components/Carousel';

export default function AboutUs() {
  return (
    <div>
      <Head>
        <title>Carousel Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Carousel />
      </main>
    </div>
  );
}
