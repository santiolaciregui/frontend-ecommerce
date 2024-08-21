'use client';

import React, { useState, useEffect } from 'react';
import apiServiceCategories from "../../../pages/api/category";
import { Category, Product } from '@/app/context/types';

interface CategoryForm {
  name: string;
}

const CreateCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CategoryForm>({ name: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await apiServiceCategories.fetchCategories();
        setCategories(fetchedCategories);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await apiServiceCategories.createCategory(formData);
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
      <h2 className="text-2xl font-semibold mb-4">Crear Nueva Categoria</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700">Nombre de la Categoria</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-md font-medium text-gray-700">
            Categorias Actuales:  
            <br />
          {categories.map(category => category.name).join(', ')}
          </label>
        </div>

        <button
          type="submit"
          className="w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Categoria'}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CreateCategory;
