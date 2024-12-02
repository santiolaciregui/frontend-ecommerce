'use client';
import React, { useState, useEffect } from 'react';
import apiService from "../../pages/api/category";
import { Category } from '@/app/context/types';
import Link from 'next/link';

const CategoryAdminList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await apiService.fetchCategories();
        console.log("categories: "+fetchedCategories);
        setCategories(fetchedCategories);
      } catch (err) {
        setError('Error fetching categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: number) => {
    try {
      setLoading(true);
      await apiService.deleteCategoryByID({ id: categoryId });
      alert('Categoría eliminada con éxito');
      const fetchedCategories = await apiService.fetchCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      setError('Error al eliminar la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderCategories = (categories: Category[], parentId: number | null = null, level: number = 0) => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => (
        <React.Fragment key={category.id}>
          <tr className="hover:bg-gray-100">
            <td className="px-6 py-4 border-b text-gray-700">
              {category.id}
            </td>
            <td className={`px-6 py-4 border-b text-gray-900 font-medium ${level > 0 ? 'pl-6' : ''}`}>
              {level > 0 ? '— '.repeat(level) : ''}
              {category.name}
            </td>
            <td className="px-6 py-4 border-b text-gray-700">
              {category.parentId ? `ID: ${category.parentId}` : '—'}
            </td>
            <td className="px-6 py-4 border-b">
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </td>
          </tr>
          {renderCategories(categories, category.id, level + 1)}
        </React.Fragment>
      ));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Lista de Categorías</h2>
          <Link
            href="/admin/categories/create"
            className="w-36 text-sm rounded-lg ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200"
          >
            Añadir Categoría
          </Link>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-4 border-b text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-6 py-4 border-b text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-6 py-4 border-b text-left text-sm font-medium text-gray-700">Subcategoría de</th>
                <th className="px-6 py-4 border-b text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                renderCategories(categories)
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No hay categorías disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdminList;
