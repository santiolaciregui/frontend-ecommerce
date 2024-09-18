'use client'
import React, { useState, useEffect } from 'react';
import apiServiceProduct from "../../../pages/api/products";
import apiServiceCategory from "../../../pages/api/category";
import Image from 'next/image';
import { Category, Product } from '@/app/context/types';
import { createDiscount } from "../../../pages/api/discount";

interface DiscountForm {
  name: string;
  discount_percent: number;
  description: string;
  active: string;  // Cambio a string para manejar el select
  category_id?: number;
  selectedProducts: number[];
}

const DiscountForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<DiscountForm>({
    name: '',
    discount_percent: 0,
    description: '',
    active: 'true', // Valor por defecto como string
    category_id: undefined,
    selectedProducts: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await apiServiceCategory.fetchCategories();
        setCategories(fetchedCategories);

        const fetchedProducts = await apiServiceProduct.fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'discount_percent' ? parseFloat(value) : value,
    });
  };

  const handleProductSelect = (productId: number) => {
    setFormData(prevFormData => {
      const isSelected = prevFormData.selectedProducts.includes(productId);
      const selectedProducts = isSelected
        ? prevFormData.selectedProducts.filter(id => id !== productId)
        : [...prevFormData.selectedProducts, productId];
      return { ...prevFormData, selectedProducts };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const discountData = {
        name: formData.name,
        percentage: formData.discount_percent,
        description: formData.description,
        active: formData.active === 'true', // Convertimos el string a booleano
        selectedProducts: formData.selectedProducts
      };
      await createDiscount(discountData);
      setSuccessMessage('Descuento creado con éxito');
      setFormData({
        name: '',
        discount_percent: 0,
        description: '',
        active: 'true',
        category_id: undefined,
        selectedProducts: [],
      });
    } catch (err) {
      setError('Error al crear el descuento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Crear Nuevo Descuento</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre del Descuento</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Porcentaje de Descuento (%)</label>
          <input
            type="number"
            name="discount_percent"
            value={formData.discount_percent}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Activo</label>
          <select
            name="active"
            value={formData.active}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Seleccionar Categoría</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">--Seleccionar Categoría--</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Productos Individuales</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(product => (
              <div
                key={product.id}
                className={`flex items-center p-2 border rounded ${
                  formData.selectedProducts.includes(product.id) ? 'bg-green-100' : 'bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.selectedProducts.includes(product.id)}
                  onChange={() => handleProductSelect(product.id)}
                  className="mr-2"
                />
                <div className="flex items-center space-x-4">
                  {product && product.Images ? ( 
                    <Image src={product.Images[0].url || '/logo-verde-manzana.pvg'} alt={product.name} width={50} height={50} className="rounded" />
                  ) : (
                    <Image src={'/logo-verde-manzana.pvg'} alt={product.name} width={50} height={50} className="rounded" />
                  )}
                  <div>
                    <h4 className="text-sm font-medium">{product.name}</h4>
                    <p className="text-xs text-gray-500">
                    {product.Categories.map(category => category.name).join(', ')} - ${product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Descuento'}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      </form>
    </div>
  );
};

export default DiscountForm;
