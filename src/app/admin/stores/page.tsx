'use client';

import React, { useState, useEffect } from 'react';
import apiService from "../../pages/api/stores";
import { Store } from '@/app/context/types';
import Link from 'next/link';

const StoreAdminList = () => { 
  const [stores, setStores] = useState<Store[]>([]);
  const [formData, setFormData] = useState<Store>({
    id: 0,
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    isActive: true,
  });
  const [editMode, setEditMode] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const fetchedStores = await apiService.fetchStores();
        setStores(fetchedStores);
      } catch (err) {
        setError('Error fetching stores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleEdit = (store: Store) => {
    setFormData(store);
    setEditMode(true);
  };

  const handleDelete = async (storeId: number) => {
    try {
      setLoading(true);
      await apiService.deleteStore({id: storeId});
      alert('Sucursal eliminada con éxito');
      const fetchedStores = await apiService.fetchStores();
      setStores(fetchedStores);
    } catch (err) {
      setError('Error al eliminar la sucursal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Lista de Sucursales</h2>
          <Link 
              href='/admin/stores/create' 
              className="w-36 text-sm rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200"
          >
              Añadir Sucursal
          </Link>
        </div>

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-4 border-b">Nombre</th>
              <th className="px-6 py-4 border-b">Dirección</th>
              <th className="px-6 py-4 border-b">Ciudad</th>
              <th className="px-6 py-4 border-b">Estado</th>
              <th className="px-6 py-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td className="px-6 py-4 border-b">{store.name}</td>
                <td className="px-6 py-4 border-b">{store.address}</td>
                <td className="px-6 py-4 border-b">{store.city}</td>
                <td className="px-6 py-4 border-b">{store.state}</td>
                <td className="px-6 py-4 border-b">
                  <button
                    onClick={() => handleEdit(store)}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(store.id!)}
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
  );
};

export default StoreAdminList;