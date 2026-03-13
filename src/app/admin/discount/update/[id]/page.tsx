'use client'
import React, { useState, useEffect } from 'react';
import apiServiceProduct from "../../../../pages/api/products";
import apiServiceCategory from "../../../../pages/api/category";
import Image from 'next/image';
import { Category, Product } from '@/app/context/types';
import { fetchDiscountById, updateDiscount } from "../../../../pages/api/discount";
import { getImageUrl } from '@/app/utils/getImageURL';
import BackButton from '@/app/components/BackButton';
import { useRouter } from 'next/navigation';

interface DiscountForm {
  name: string;
  discount_percent: number;
  description: string;
  active: string;
  category_id?: number;
  selectedProducts: number[];
  start_date: string;
  end_date: string;
}

const DiscountUpdateForm = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<DiscountForm>({
    name: '',
    discount_percent: 0,
    description: '',
    active: 'true',
    category_id: undefined,
    selectedProducts: [],
    start_date: '',
    end_date: '',
  });

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  // Agrupar productos por la primera categoría que tengan
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName = product.Categories && product.Categories.length > 0
      ? product.Categories[0].name
      : 'Sin categoría';

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingInitial(true);
      try {
        const [fetchedCategories, fetchedProducts, fetchedDiscount] = await Promise.all([
          apiServiceCategory.fetchParentCategories(),
          apiServiceProduct.fetchAllProducts(true),
          fetchDiscountById(params.id)
        ]);
        
        setCategories(fetchedCategories);
        setProducts(fetchedProducts);

        const startDateFormatted = fetchedDiscount.start_date ? new Date(fetchedDiscount.start_date).toISOString().split('T')[0] : '';
        const endDateFormatted = fetchedDiscount.end_date ? new Date(fetchedDiscount.end_date).toISOString().split('T')[0] : '';

        // Extract selected products if available in the API response format
        // Backend models might differ, assuming typical association
        const selectedProdIds = fetchedDiscount.Products ? fetchedDiscount.Products.map((p: any) => p.id) : [];

        setFormData({
          name: fetchedDiscount.name || '',
          discount_percent: fetchedDiscount.percentage || 0,
          description: fetchedDiscount.description || '',
          active: fetchedDiscount.active ? 'true' : 'false',
          category_id: fetchedDiscount.categoryId || undefined, // Adjust based on your backend Category connection
          selectedProducts: selectedProdIds,
          start_date: startDateFormatted,
          end_date: endDateFormatted,
        });

      } catch (err) {
        setError('Error fetching discount data');
        console.error(err);
      } finally {
        setLoadingInitial(false);
      }
    };

    if (params.id) {
        fetchInitialData();
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'discount_percent' ? parseFloat(value) : value,
    });
  };

  const handleProductSelect = (productId: number) => {
    setFormData(prevFormData => {
      const isSelected = prevFormData.selectedProducts.includes(productId);
      const selectedProducts = isSelected
        ? prevFormData.selectedProducts.filter(id => id !== productId)
        : [...prevFormData.selectedProducts, productId];
      return { ...prevFormData, selectedProducts };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const discountData = {
        name: formData.name,
        percentage: formData.discount_percent,
        description: formData.description,
        active: formData.active === 'true',
        selectedProducts: formData.selectedProducts,
        start_date: formData.start_date,
        end_date: formData.end_date,
      };
      await updateDiscount(params.id, discountData);
      setSuccessMessage('Descuento actualizado con éxito');
      router.push('/admin/discount');
    } catch (err) {
      setError('Error al actualizar el descuento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            Cargando...
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-10">
      <BackButton destination="/admin/discount" />
      <h2 className="text-2xl font-semibold mb-4">Editar Descuento</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre del Descuento</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Porcentaje de Descuento (%)</label>
          <input
            type="number"
            name="discount_percent"
            value={formData.discount_percent}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Activo</label>
          <select
            name="active"
            value={formData.active}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Seleccionar Categoría</label>
          <select
            name="category_id"
            value={formData.category_id || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">--Seleccionar Categoría--</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Productos Individuales (agrupados por categoría)</label>
          <div className="space-y-4">
            {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
              <div key={categoryName} className="border border-gray-300 rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleCategory(categoryName)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 font-medium flex justify-between items-center"
                >
                  <span>{categoryName} ({categoryProducts.length} productos)</span>
                  <i className={`fas fa-chevron-${openCategories.includes(categoryName) ? 'up' : 'down'}`}></i>
                </button>
                {openCategories.includes(categoryName) && (
                  <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200">
                    {categoryProducts.map(product => (
                      <div
                        key={product.id}
                        className={`flex items-center p-2 border rounded ${
                          formData.selectedProducts.includes(product.id) ? 'bg-green-100' : 'bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedProducts.includes(product.id)}
                          onChange={() => handleProductSelect(product.id)}
                          className="mr-2"
                        />
                        <div className="flex items-center space-x-4">
                          {product && product.Images && product.Images[0] ? ( 
                          <Image
                          src={
                            product.Images[0]
                              ? getImageUrl(product.Images[0].url)
                              : "/logo-verde-manzana.svg"
                          }
                          alt={product.name}
                          width={50} height={50}
                          className="rounded"
                          />         
                                 ) : (
                            <Image src={'/logo-verde-manzana.svg'} alt={product.name} width={50} height={50} className="rounded" />
                          )}
                          <div>
                            <h4 className="text-sm font-medium">{product.name}</h4>
                            <p className="text-xs text-gray-500">${product.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Actualizar Descuento'}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      </form>
    </div>
  );
};

export default DiscountUpdateForm;
