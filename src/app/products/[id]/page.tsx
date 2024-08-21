'use client'
import ProductImages from "@/app/components/ProductImages";
import CustomizeProducts from "@/app/components/CustomizeProducts";
import Add from "@/app/components/Add";
import { notFound } from "next/navigation";
import { Product } from "../../context/types";
import { fetchProductByID } from "../../pages/api/products";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

const SinglePage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null); // Use the Product type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const fetchedProduct = await fetchProductByID({ id });
          setProduct(fetchedProduct);
        } catch (err) {
          setError('ddas');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div className='px-4 mt-12 md:px-8 lg:px-16 xl:32 2xl:px-64 relative flex flex-col lg:flex-row gap-16'>
      {/* Image */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.images} />
      </div>
      {/* Texts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
        <p className="text-gray-500">
          {product.description}
        </p>
        <div className="h-[2px] bg-gray-100" />
        {product.price === product.price ? (
          <h2 className="font-medium text-2xl">${product.price}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500">${product.price}</h3>
          </div>
        )}
        <div className="h-[2px] bg-gray-100" />
        {product.stock ? (
          <CustomizeProducts 
            product={product} 
          />
        ) : (
          <button 
          className="2-36 text-sm rounded-2xl ring-1 ring-gray-400 text-gray-400 py-2 px-4  cursor-default bg-gray-200 text-gray-500' : 'hover:bg-gray-400 hover:text-white'"
        >
          No disponible
        </button>
        
        )}
        <div className="h-[2px] bg-gray-100"/>
          { product.description ?  (
            <div className="text-sm" key={product.id}>
              <h4 className="font-medium mb-4">Descripcion del Producto</h4>
              <p>{product.description}</p>
            </div>
          ) : (
            <h4 className="font-medium mb-4">Sin Información Adicion</h4>
          )}
        </div>
      </div>
  );
};

export default SinglePage;
