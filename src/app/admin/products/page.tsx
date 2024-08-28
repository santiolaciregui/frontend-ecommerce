'use client';
import React, { useState, useEffect } from 'react';
import apiService, { fetchAllProducts } from "../../pages/api/products";
import { Product, Category, Discount, Option } from '@/app/context/types';
import Link from 'next/link';

const AdminList = () => { 
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: '',
    SKU: '',
    description: '',
    price: 0,
    stock: 0,
    weight: 0,
    Categories: [],
    Discounts: [],
    Options: [],
    Images: [],
    getFinalPrice: async () => 0
  });
  const [editMode, setEditMode] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await apiService.fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Error fetching products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditMode(true);
  };

  const handleDelete =  async (product_id : number) => {
    try {
      setLoading(true);
      await apiService.deleteProductByID({id: product_id});
      alert('Producto eliminado con éxito');
      fetchAllProducts();
    } catch (err) {
      setError('Error al crear la promoción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto mt-10">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Lista de Productos</h2>
          <Link 
              href='/admin/products/create' className="w-36 text-sm rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200"
          >
              Añadir Producto
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-4 border-b">SKU</th>
                <th className="px-6 py-4 border-b">Nombre</th>
                <th className="px-6 py-4 border-b">Categoría</th>
                <th className="px-6 py-4 border-b">Precio</th>
                <th className="px-6 py-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 border-b">{product.SKU}</td>
                  <td className="px-6 py-4 border-b">{product.name}</td>
                  <td className="px-6 py-4 border-b">
                    {product.Categories.map(category => category.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 border-b">${product.price}</td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminList;
