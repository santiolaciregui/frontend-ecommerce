// Import necessary dependencies
'use client'
import { useEffect, useState } from 'react';
import ProductImages from "@/app/components/ProductImages";
import CustomizeProducts from "@/app/components/CustomizeProducts";
import Add from "@/app/components/Add";
import { fetchProductByID } from "../../pages/api/products";
import { fetchStores } from "../../pages/api/stores"; // Asumiendo que este es tu endpoint
import { useParams } from "next/navigation";
import { Product, Store } from '@/app/context/types';

const SinglePage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  const currentPrice = product.price;
  const activeDiscounts = product.Discounts?.filter(discount => discount.active);
  const bestDiscount = activeDiscounts?.reduce((max, discount) => 
    discount.percentage > max.percentage ? discount : max, activeDiscounts[0]);

  const finalPrice = bestDiscount
    ? (currentPrice * (1 - bestDiscount.percentage / 100)).toFixed(2)
    : currentPrice.toFixed(2);

  const discountPercentage = bestDiscount?.percentage || null;

  return (
    <div className='px-4 mt-12 md:px-8 lg:px-16 xl:32 2xl:px-64 relative flex flex-col lg:flex-row gap-16'>
      {/* Image */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.Images} />
      </div>
      
      {/* Texts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
        
        <div className="flex items-center gap-4">
          {discountPercentage && (
            <h3 className="text-xl text-gray-500 line-through">${currentPrice.toFixed(2)}</h3>
          )}
          <h2 className="font-medium text-2xl">${finalPrice}</h2>
        </div>
        
        <div className="discount-info">
          <p>15% de descuento pagando con Transferencia Bancaria</p>
        </div>
        
        <div className="h-[2px] bg-gray-100" />
        
        {product.stock ? (
          <CustomizeProducts product={product} />
        ) : (
          <button className="w-36 text-sm rounded-2xl ring-1 ring-gray-400 text-gray-400 py-2 px-4 cursor-default bg-gray-200">
            No disponible
          </button>
        )}
        
        {/* Medios de envío */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <button 
            className="flex justify-between items-center w-full py-2 text-left" 
            onClick={() => setIsShippingOpen(!isShippingOpen)}
          >
            <h3 className="font-medium text-lg">Medios de envío</h3>
            <span>{isShippingOpen ? '-' : '+'}</span>
          </button>
          
          {isShippingOpen && (
            <div className="shipping-options mt-2">
              <input 
                type="text" 
                className="border border-gray-300 p-2 rounded w-full" 
                placeholder="Tu código postal" 
              />
              <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded mt-2">
                CALCULAR
              </button>
              <a href="#" className="text-sm text-blue-500 mt-2 block">No sé mi código postal</a>
            </div>
          )}
        </div>
        
        {/* Nuestros locales */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <button 
            className="flex justify-between items-center w-full py-2 text-left" 
            onClick={() => setIsStoresOpen(!isStoresOpen)}
          >
            <h3 className="font-medium text-lg">Nuestros locales</h3>
            <span>{isStoresOpen ? '-' : '+'}</span>
          </button>
          
          {isStoresOpen && (
            <div className="local-stores mt-2">
              {stores.length > 0 ? (
                stores.map(store => (
                  <div key={store.id} className="bg-gray-100 p-4 rounded mt-2">
                    <p>{store.name}</p>
                    <p>{store.address}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay locales disponibles</p>
              )}
            </div>
          )}
        </div>

        <div className="h-[2px] bg-gray-100"/>
        {product.description ?  (
          <div className="text-sm" key={product.id}>
            <h4 className="font-medium mb-4">Descripción del Producto</h4>
            <p>{product.description}</p>
          </div>
        ) : (
          <h4 className="font-medium mb-4">Sin Información Adicional</h4>
        )}
      </div>
    </div>
  );
};

export default SinglePage;
