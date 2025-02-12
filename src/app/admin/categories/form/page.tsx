'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiServiceCategories from "../../../pages/api/category";
import { Category } from '@/app/context/types';
import BackButton from '@/app/components/BackButton';

interface CategoryForm {
  name: string;
  parentId?: number;
}

// Loading component for Suspense fallback
const LoadingState = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded w-full mt-8"></div>
      </div>
    </div>
  </div>
);

// Form content component
const CategoryFormContent = () => {
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

        if (isEditing && categoryId) {
          const categoryData = await apiServiceCategories.fetchCategoryById(parseInt(categoryId));
          setFormData({
            name: categoryData.name,
            parentId: categoryData.parentId || undefined,
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
      if (isEditing && categoryId) {
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <BackButton destination="/admin/categories" />
      <h2 className="text-2xl font-semibold mb-4">
        {isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre de la Categoría
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
            Categoría Padre (opcional)
          </label>
          <select
            id="parentId"
            name="parentId"
            value={formData.parentId || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Ninguna</option>
            {categories
              .filter(category => !isEditing || category.id !== parseInt(categoryId || ''))
              .map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={loading}
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar Categoría' : 'Guardar Categoría'}
        </button>
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

// Main component with Suspense wrapper
const CategoryFormComponent = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <CategoryFormContent />
    </Suspense>
  );
};

export default CategoryFormComponent;