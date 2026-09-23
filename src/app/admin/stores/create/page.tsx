'use client';

import React, { Suspense, useState, useEffect } from 'react';
import apiService from "../../../pages/api/stores";
import { Store } from '@/app/context/types';
import { useRouter, useSearchParams } from 'next/navigation';
import BackButton from '@/app/components/BackButton';
import { getImageUrl } from '@/app/utils/getImageURL';

const CreateEditStore = () => {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id') ? Number(params.get('id')) : undefined;
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Store>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    isActive: true,
    googlePlaceId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchStore = async () => {
        setLoading(true);
        try {
          const store = await apiService.fetchStoreById(id);
          setFormData(store);
        } catch (err) {
          setError('Error fetching store');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchStore();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let savedStore;
      if (isEditMode && id) {
        savedStore = await apiService.updateStore(id, formData);
      } else {
        savedStore = await apiService.createStore(formData);
      }
      if (image) await apiService.updateStoreImage(savedStore.id, image);
      router.push('/admin/stores');
    } catch (err) {
      setError('No se pudo guardar la sucursal o su foto. Revisá los datos e intentá nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <BackButton destination="/admin/stores" />
        <h2 className="text-2xl font-semibold mb-6">
          {isEditMode ? 'Editar Sucursal' : 'Crear Nueva Sucursal'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              Ciudad
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
              Estado
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
              Código Postal
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ej.: +54 9 299 123 4567"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store-image">Foto del local</label>
            {formData.imageUrl && <img src={getImageUrl(formData.imageUrl)} alt={`Foto actual de ${formData.name}`} className="mb-3 h-40 w-full rounded object-cover" />}
            <input id="store-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setImage(event.target.files?.[0] || null)} className="block w-full text-sm" />
            <p className="mt-1 text-xs text-gray-500">JPG, PNG o WebP. Máximo 8 MB.</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="googlePlaceId">ID de la ficha en Google Maps</label>
            <input type="text" id="googlePlaceId" name="googlePlaceId" value={formData.googlePlaceId || ''} onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="ChIJ..." />
            <p className="mt-1 text-xs text-gray-500">Vinculá la ficha exacta de este local para mostrar sus reseñas en Clientes Felices. <a href="https://developers.google.com/maps/documentation/places/web-service/place-id#find-id" target="_blank" rel="noopener noreferrer" className="underline">Buscar ID del lugar</a>.</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">Activa</span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default function StorePage() {
  return <Suspense fallback={<div className="p-8">Cargando sucursal...</div>}><CreateEditStore /></Suspense>;
}
