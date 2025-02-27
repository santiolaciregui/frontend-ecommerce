// app/admin/home/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { fetchCarouselImages, uploadCarouselImages, deleteCarouselImage, deleteAllCarouselImages } from '../../pages/api/dashboard';
import PromoCarousel from '@/app/components/PromoCarousel';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/components/BackButton';
import { getImageUrl } from '@/app/utils/getImageURL';

const DashboardHomeManager = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

  // Load carousel images
  const loadImages = async () => {
    try {
      setIsLoading(true);
      const carouselImages = await fetchCarouselImages();
      setImages(carouselImages);
      setError('');
    } catch (err) {
      setError('Error al cargar las imágenes del carrusel');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  // Handle file upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      setError('Por favor, selecciona archivos para subir');
      return;
    }
    
    try {
      setIsLoading(true);
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });
      
      await uploadCarouselImages(formData);
      setSelectedFiles([]);
      await loadImages(); // Reload the images
      setError('');
    } catch (err) {
      setError('Error al subir las imágenes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async (imagePath: string) => {
    const filename = imagePath.split('/').pop();
    if (!filename) return;
    
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta imagen?');
    if (!confirmDelete) return;
    
    try {
      setIsLoading(true);
      await deleteCarouselImage(filename);
      await loadImages(); // Reload the images
    } catch (err) {
      setError('Error al eliminar la imagen');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete all images
  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar TODAS las imágenes del carrusel? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;
    
    try {
      setIsLoading(true);
      await deleteAllCarouselImages();
      await loadImages(); // Reload the images
    } catch (err) {
      setError('Error al eliminar todas las imágenes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">Administración de Inicio</h1>
        </div>
        
        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Cargar Nuevas Imágenes para el Carrusel</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Imágenes
              </label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
              <p className="mt-1 text-sm text-gray-500">
                Puedes seleccionar múltiples imágenes (máximo 10)
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isLoading ? 'Cargando...' : 'Subir Imágenes'}
              </button>
              <button 
                type="button" 
                onClick={handleDeleteAll}
                disabled={isLoading || images.length === 0} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                Eliminar Todas
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
        
        {/* Preview Carousel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Vista Previa del Carrusel</h2>
          {images.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <PromoCarousel images={images} />
            </div>
          ) : (
            <p className="text-gray-500 py-10 text-center">
              No hay imágenes disponibles. Sube algunas imágenes para ver el carrusel.
            </p>
          )}
        </div>
        
        {/* Image Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Administrar Imágenes del Carrusel</h2>
          {isLoading ? (
            <p className="text-center py-4">Cargando imágenes...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={getImageUrl(image)} 
                    alt={`Imagen ${index + 1}`} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 flex justify-between items-center bg-gray-50">
                    <span className="text-sm text-gray-600 truncate">
                      Imagen {index + 1}
                    </span>
                    <button
                      onClick={() => handleDelete(image)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              
              {images.length === 0 && (
                <p className="text-gray-500 col-span-full text-center py-4">
                  No hay imágenes disponibles.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeManager;