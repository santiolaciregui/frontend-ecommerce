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
        const fetchedCategories = await apiService.fetchParentCategories();
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
      await apiService.deleteCategory({id: categoryId});
      alert('Categoría eliminada con éxito');
      const fetchedCategories = await apiService.fetchParentCategories();
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
          <tr>
            <td className="px-6 py-4 border-b" style={{ paddingLeft: `${level * 20}px` }}>
              {category.name}
            </td>
            <td className="px-6 py-4 border-b">
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-500 hover:underline"
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
          <h2 className="text-2xl font-semibold">Lista de Categorías</h2>
          <Link 
              href='/admin/categories/create' className="w-36 text-sm rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200"
          >
              Añadir Categoría
          </Link>
        </div>

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-4 border-b">Nombre</th>
              <th className="px-6 py-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {renderCategories(categories)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryAdminList;