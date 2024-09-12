// HomePage.jsx
import CategoriesMenu from './components/CategoriesMenu';
import PromoCarousel from './components/PromoCarousel';

const HomePage = () => {
  const promoImages = [
    '/carousel1.png',
    '/carousel2.png',
    '/carousel3.png',
  ];

  const categories = [
    { name: 'Silla', image: '/silla1.ong' },
    { name: 'Sillones', image: '/sillon.png' },
    // Add all other categories
  ];

  return (
    <div>
      {/* Promo Carousel */}
      <PromoCarousel images={promoImages} />

      {/* Categories Section */}
      <CategoriesMenu categories={categories} />
    </div>
  );
};

export default HomePage;
