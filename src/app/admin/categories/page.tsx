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
      await apiService.deleteCategory(categoryId);
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
            <td className="px-6 py-4 flex justify-center space-x-4">
            <button
              onClick={() => handleDelete(category.id)}
              className="text-red-500 hover:text-red-700"
              title="Eliminar"
            >
              <i className="fas fa-trash-alt mr-2"></i>
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
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
          >
            <i className="fas fa-plus mr-2"></i>
            Añadir categoría
          </Link>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200 text-gray-600 text-sm uppercase font-semibold">
                <tr>
                  <th className="text-left px-6 py-3">ID</th>
                  <th className="text-left px-6 py-3">Nombre</th>
                  <th className="text-left px-6 py-3">Subcategoría de</th>
                  <th className="text-center px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
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
