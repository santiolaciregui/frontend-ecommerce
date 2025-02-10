'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiServiceCategories from "../../../pages/api/category";
import { Category } from '@/app/context/types';
import BackButton from '@/app/components/BackButton';

interface CategoryForm {
  name: string;
  parentId?: number;
}

const CategoryFormComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('id');
  const isEditing = !!categoryId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CategoryForm>({ name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await apiServiceCategories.fetchParentCategories();
        setCategories(fetchedCategories);

        if (isEditing) {
          const categoryData = await apiServiceCategories.fetchCategoryById(parseInt(categoryId));
          setFormData({
            name: categoryData.name,
            parentId: categoryData.parentId || undefined
          });
        }
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [categoryId, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'parentId' ? (value ? parseInt(value) : undefined) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (isEditing) {
        await apiServiceCategories.updateCategory(parseInt(categoryId), formData);
        alert('Categoría actualizada con éxito');
      } else {
        await apiServiceCategories.createCategory(formData);
        alert('Categoría creada con éxito');
      }
      router.push('/admin/categories');
    } catch (err) {
      setError(isEditing ? 'Error al actualizar la categoría' : 'Error al crear la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="max-w-4xl mx-auto p-6">Cargando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <BackButton destination="/admin/categories" />
      <h2 className="text-2xl font-semibold mb-4">
        {isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
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
          <label className="block text-sm font-medium text-gray-700">Categoría Padre (opcional)</label>
          <select
            name="parentId"
            value={formData.parentId || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Ninguna</option>
            {categories
              .filter(category => !isEditing || category.id !== parseInt(categoryId))
              .map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar Categoría' : 'Guardar Categoría'}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CategoryFormComponent;