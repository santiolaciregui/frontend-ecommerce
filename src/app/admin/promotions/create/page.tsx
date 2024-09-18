'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import apiServiceProducts from "../../../pages/api/products";
import apiServicePromotions from "../../../pages/api/promotions";
import apiServiceCategories from "../../../pages/api/category";
import { Category, Product } from '@/app/context/types';

interface PromotionForm {
  name: string;
  credit_card_id?: number;
  installments?: number;
  start_date: string;
  end_date: string;
  selectedProducts: number[];
  selectedCategories: number[];
}

const CreatePromotion = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [creditCards, setCreditCards] = useState<{ id: number, name: string }[]>([]);
  const [formData, setFormData] = useState<PromotionForm>({
    name: '',
    credit_card_id: undefined,
    installments: undefined,
    start_date: '',
    end_date: '',
    selectedProducts: [],
    selectedCategories: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await apiServiceCategories.fetchParentCategories();
        setCategories(fetchedCategories);

        const fetchedProducts = await apiServiceProducts.fetchAllProducts();
        setProducts(fetchedProducts);
        
        const fetchedCreditCards = await apiServicePromotions.fetchCreditCards();
        setCreditCards(fetchedCreditCards);

      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'installments' ? parseInt(value) : value,
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

  const handleCategorySelect = (categoryId: number) => {
    setFormData(prevFormData => {
      const isSelected = prevFormData.selectedCategories.includes(categoryId);
      const selectedCategories = isSelected
        ? prevFormData.selectedCategories.filter(id => id !== categoryId)
        : [...prevFormData.selectedCategories, categoryId];
      return { ...prevFormData, selectedCategories };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await apiServicePromotions.createPromotion(formData);
      alert('Promoción creada con éxito');
    } catch (err) {
      setError('Error al crear la promoción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Crear Nueva Promoción</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre de la Promoción</label>
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
          <label className="block text-sm font-medium text-gray-700">Tarjeta de Crédito</label>
          <select
            name="credit_card_id"
            value={formData.credit_card_id || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">--Seleccionar Tarjeta de Crédito--</option>
            {creditCards.map(card => (
              <option key={card.id} value={card.id}>
                {card.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cantidad de Cuotas sin Interés</label>
          <input
            type="number"
            name="installments"
            value={formData.installments || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Seleccionar Categorías</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className={`flex items-center p-2 border rounded ${
                  formData.selectedCategories.includes(category.id) ? 'bg-green-100' : 'bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.selectedCategories.includes(category.id)}
                  onChange={() => handleCategorySelect(category.id)}
                  className="mr-2"
                />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
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
                  {product.Images ? (
                    <Image src={product.Images[0].url} alt={product.name} width={50} height={50} className="rounded" />
                  ) : (
                    <Image src={'/logo-verde-manzana.png'} alt={product.name} width={50} height={50} className="rounded" />
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
          {loading ? 'Guardando...' : 'Guardar Promoción'}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CreatePromotion;
