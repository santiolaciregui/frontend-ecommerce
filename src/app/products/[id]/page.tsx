// Import necessary dependencies
'use client'
import { useEffect, useState } from 'react';
import ProductImages from "@/app/components/ProductImages";
import CustomizeProducts from "@/app/components/CustomizeProducts";
import { fetchProductByID } from "../../pages/api/products";
import { fetchStores } from "../../pages/api/stores"; // Asumiendo que este es tu endpoint
import { useParams } from "next/navigation";
import { Product, Store } from '@/app/context/types';
import Loading from '@/app/components/Loading';
import PaymentModal from '@/app/components/modalPayments';

const SinglePage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isStoresOpen, setIsStoresOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const fetchedProduct = await fetchProductByID({ id });
          setProduct(fetchedProduct);
        } catch (err) {
          setError('Error al cargar el producto');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // Fetch stores
  useEffect(() => {
    const loadStores = async () => {
      try {
        const response = await fetchStores(); // Llama al endpoint para cargar los locales
        setStores(response);
      } catch (err) {
        setError('Error al cargar los locales');
      }
    };

    loadStores();
  }, []);

  if (!product) return <h1>No product found</h1>;

  const currentPrice = product.price;
  const activeDiscounts = product.Discounts?.filter(discount => discount.active);
  const bestDiscount = activeDiscounts?.reduce((max, discount) => 
    discount.percentage > max.percentage ? discount : max, activeDiscounts[0]);

  const finalPrice = bestDiscount
    ? (currentPrice * (1 - bestDiscount.percentage / 100)).toFixed(2)
    : currentPrice.toFixed(2);

  const discountPercentage = bestDiscount?.percentage || null;

  return (
    <div className='px-4 mt-12 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16'>
      {/* Image */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.Images} />
      </div>
      
      {/* Texts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium text-gray-800">{product.name}</h1>
        
        <div className="flex items-center gap-4">
          {discountPercentage && (
            <h3 className="text-xl text-gray-500 line-through">${currentPrice.toFixed(2)}</h3>
          )}
          <h2 className="font-medium text-2xl text-gray-800">${finalPrice}</h2>
        </div>
        
        <button
  onClick={() => setIsPaymentModalOpen(true)}
  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
>
  <i className="fas fa-info-circle"></i>
  Ver formas de pago disponibles
</button>
        <div className="h-[2px] bg-gray-200 my-4" />
        
        {product.stock ? (
          <CustomizeProducts product={product} />
        ) : (
          <button className="w-36 text-sm rounded-2xl ring-1 ring-gray-400 text-gray-400 py-2 px-4 cursor-default bg-gray-200">
            No disponible
          </button>
        )}
        
        {/* Nuestros locales */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <button 
            className="flex justify-between items-center w-full py-2 text-left hover:bg-gray-100 transition-colors duration-200" 
            onClick={() => setIsStoresOpen(!isStoresOpen)}
          >
            <h3 className="font-medium text-lg flex items-center text-gray-800">
              <i className="fas fa-store mr-2"></i> Puntos de Retiro
            </h3>
            <span>
              <i className={`fas ${isStoresOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </span>
          </button>
          
          {isStoresOpen && (
            <div className="local-stores mt-2">
              {stores.length > 0 ? (
                stores.map(store => (
                  <div key={store.id} className="bg-gray-100 p-4 rounded mt-2 shadow-md">
                    <p className="font-semibold text-lg text-gray-800"><i className="fas fa-map-marker-alt mr-2"></i>{store.name}</p>
                    <p className="text-gray-700"><i className="fas fa-map-pin mr-2"></i>{store.address} - {store.city}, {store.state}</p>
                    <p className="text-gray-700"><i className="fas fa-phone mr-2"></i>{store.phone}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay locales disponibles</p>
              )}
            </div>
          )}
        </div>

        <div className="h-[2px] bg-gray-200 my-4"/>
        {product.description ? (
          <div className="text-sm" key={product.id}>
            <h4 className="font-medium mb-4 flex items-center text-gray-800">
              <i className="fas fa-info-circle mr-2"></i> Descripción del Producto
            </h4>
            <p className="text-gray-700">{product.description}</p>
          </div>
        ) : (
          <h4 className="font-medium mb-4 flex items-center text-gray-800">
            <i className="fas fa-exclamation-circle mr-2"></i> Sin Información Adicional
          </h4>
        )}
      </div>
      <PaymentModal
  isOpen={isPaymentModalOpen}
  onClose={() => setIsPaymentModalOpen(false)}
/>
    </div>

    
  );
};

export default SinglePage;
