'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/components/BackButton';
import { getImageUrl } from '@/app/utils/getImageURL';
import { 
  fetchReviewImages, 
  uploadReviewImages, 
  deleteReviewImage, 
  deleteAllReviewImages
} from '@/app/pages/api/reviews';

const ReviewsManager = () => {
  const [reviewImages, setReviewImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    loadReviewImages();
  }, []);

  const loadReviewImages = async () => {
    try {
      setIsLoading(true);
      const reviews = await fetchReviewImages();
      setReviewImages(reviews);
    } catch (error) {
      console.error('Error fetching review images:', error);
      setError('Error al cargar las imágenes de reseñas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleUploadImages = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      setError('Por favor selecciona al menos una imagen para subir');
      return;
    }
    
    try {
      setUploading(true);
      setError('');
      
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });
      
      await uploadReviewImages(formData);
      
      // Reload images after upload
      await loadReviewImages();
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Error al subir las imágenes');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleVisibility = (id: string) => {
    // Since the backend doesn't support visibility toggling yet,
    // we'll just update the local state
    setReviewImages(reviewImages.map(image => 
      image.id === id ? { ...image, isVisible: !image.isVisible } : image
    ));
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      await deleteReviewImage(imageUrl);
      setReviewImages(reviewImages.filter(img => img !== imageUrl));
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      setError('Error al eliminar la imagen');
    }
  };

  const handleDeleteAllImages = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar TODAS las imágenes? Esta acción no se puede deshacer.');
    if (confirmDelete) {
      try {
        await deleteAllReviewImages();
        setReviewImages([]);
      } catch (error) {
        console.error('Error deleting all images:', error);
        setError('Error al eliminar todas las imágenes');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">Administración de Imágenes de Reseñas</h1>
        </div>
        
        {/* Upload Images Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Subir Imágenes de Reseñas</h2>
          <form onSubmit={handleUploadImages} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccionar Imágenes (JPG, PNG, GIF)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                multiple
                onChange={handleFileChange}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
              <p className="text-sm text-gray-500">
                Puedes seleccionar múltiples imágenes a la vez. Máximo 10 imágenes, 8MB cada una.
              </p>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="space-x-2">
                <button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {uploading ? 'Subiendo...' : 'Subir Imágenes'}
                </button>
                
                <button
                  type="button"
                  onClick={handleDeleteAllImages}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar Todas las Imágenes
                </button>
              </div>
              
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </div>
        
        {/* Images Gallery */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Galería de Imágenes de Reseñas</h2>
          
          {isLoading ? (
            <p className="text-center py-4">Cargando imágenes...</p>
          ) : reviewImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {reviewImages.map((image) => (
                <div 
                  key={image.id} 
                  className={`relative group ${!image.isVisible ? 'opacity-50' : ''}`}
                >
                  <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                    <img 
                      src={getImageUrl(image)} 
                      alt={`Reseña de cliente`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleVisibility(image.id)}
                      className={`p-1 rounded-full ${
                        image.isVisible 
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                      title={image.isVisible ? 'Ocultar' : 'Mostrar'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {image.isVisible ? (
                          <path key={`visibility-${image.id}`} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path key={`visibility-${image.id}`} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">
              No hay imágenes de reseñas disponibles. Sube algunas usando el formulario de arriba.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsManager;