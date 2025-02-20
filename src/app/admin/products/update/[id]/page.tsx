'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiServiceProducts from "../../../../pages/api/products";
import apiServiceCategories from "../../../../pages/api/category";
import apiServiceOptions from "../../../../pages/api/options";
import apiServiceDiscount from "../../../../pages/api/discount";
import { Category, Discount, Option } from '@/app/context/types';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getImageUrl } from '@/app/utils/getImageURL';

// Interface for product form data.
interface ProductForm {
  name: string;
  SKU: number;
  description: string;
  price: number;
  stock: number;
  weight: number;
  categoryId: number;
  subcategoryId: number;
  discountId: number;
  optionIds: number[];
  images: File[]; // New images to be uploaded.
}

// Interface for existing images.
interface ProductImage {
  id: number;
  url: string;
}

const UpdateProduct = () => {
  const { id } = useParams();
  const router = useRouter();

  // State for select fields.
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [colorOptions, setColorOptions] = useState<Option[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Option[]>([]);
  
  // For creating a new size option on the fly.
  const [newSizeName, setNewSizeName] = useState('');
  const [creatingSize, setCreatingSize] = useState(false);

  // UI loading and error state.
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Form data (for text fields and new images).
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    SKU: 0,
    description: '',
    price: 0,
    stock: 0,
    weight: 0,
    categoryId: 0,
    subcategoryId: 0,
    discountId: 0,
    optionIds: [],
    images: []
  });

  // State for existing images loaded from the product.
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  // State to track which existing image IDs have been removed.
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  // Fetch product data and required lists concurrently.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the product details.
        const product = await apiServiceProducts.fetchProductByID({ id: Number(id) });
        setFormData({
          name: product.name,
          SKU: product.SKU,
          description: product.description,
          price: product.price,
          stock: product.stock,
          weight: product.weight,
          // Assuming product.Categories is an array where the first element holds category info:
          categoryId: product.Categories[0]?.parentId || 0,
          subcategoryId: product.Categories[0]?.id || 0,
          discountId: product.discountId || 0,
          optionIds: (product.Options as Option[]).map((option: Option) => option.id),
          images: [] // New images will be added separately.
        });
        // Set the existing images from the product.
        setExistingImages(product.Images);
        
        // Fetch parent categories, options, and discounts concurrently.
        const [fetchedCategories, fetchedOptions, fetchedDiscounts] = await Promise.all([
          apiServiceCategories.fetchParentCategories(),
          apiServiceOptions.fetchOptions(),
          apiServiceDiscount.fetchDiscounts()
        ]) as [Category[], Option[], Discount[]];

        setCategories(fetchedCategories);
        setOptions(fetchedOptions);
        setDiscounts(fetchedDiscounts);

        // Filter options into color and size.
        setColorOptions(fetchedOptions.filter((option: Option) => option.type === 0));
        setSizeOptions(fetchedOptions.filter((option: Option) => option.type === 1));
      } catch (err) {
        setError('Error al cargar los datos del producto');
        console.error(err);
      }
    };

    if (id) fetchData();
  }, [id]);

  // When the category changes, update the subcategories.
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.categoryId) {
        const selectedCategory = categories.find(category => category.id === formData.categoryId);
        if (selectedCategory) {
          if (selectedCategory.subcategories) {
            setSubcategories(selectedCategory.subcategories);
          } else {
            try {
              const subs = await apiServiceCategories.fetchSubcategoriesByParent(selectedCategory.id);
              setSubcategories(subs);
            } catch (err) {
              console.error('Error fetching subcategories:', err);
            }
          }
        }
      }
    };
    fetchSubcategories();
  }, [formData.categoryId, categories]);

  // Generic input change handler.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // When the category is changed.
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const categoryId = parseInt(value);
    setFormData(prevState => ({ ...prevState, categoryId, subcategoryId: 0 }));
    const selectedCategory = categories.find(category => category.id === categoryId);
    if (selectedCategory && selectedCategory.subcategories) {
      setSubcategories(selectedCategory.subcategories);
    } else {
      setSubcategories([]);
    }
  };

  // Handle multi-select option changes.
  const handleOptionSelect = (selectedIds: number[], type: number) => {
    setFormData(prevState => {
      // Preserve options of the other type.
      const otherTypeOptions = prevState.optionIds.filter(id => {
        const option = options.find(opt => opt.id === id);
        return option && option.type !== type;
      });
      return { ...prevState, optionIds: [...otherTypeOptions, ...selectedIds] };
    });
  };

  const getSelectedValues = (type: number) => {
    return formData.optionIds.filter(id => {
      const option = options.find(opt => opt.id === id);
      return option && option.type === type;
    });
  };

  const transformOptionsForSelect = (opts: Option[]) => {
    return opts.map((option: Option) => ({
      label: option.name,
      value: option.id
    }));
  };

  // Handle file input changes for new images.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData(prevState => ({
        ...prevState,
        images: [...prevState.images, ...Array.from(files)]
      }));
    }
  };

  // Remove a new image before upload.
  const handleImageRemove = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index)
    }));
  };

  // Mark an existing image as removed.
  const handleExistingImageRemove = (imageId: number) => {
    setRemovedImageIds(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(image => image.id !== imageId));
  };

  // Create a new size option and add it to the selected options.
  const handleCreateSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSizeName.trim()) return;
    setCreatingSize(true);
    try {
      const newOption = { name: newSizeName.trim(), type: 1 };
      const createdOption = await apiServiceOptions.createOption(newOption);
      const updatedOptions = await apiServiceOptions.fetchOptions() as Option[];
      setOptions(updatedOptions);
      setColorOptions(updatedOptions.filter((option: Option) => option.type === 0));
      setSizeOptions(updatedOptions.filter((option: Option) => option.type === 1));
      setFormData(prev => ({
        ...prev,
        optionIds: [...prev.optionIds, createdOption.id]
      }));
      setNewSizeName('');
    } catch (err) {
      setError('Error al crear la opción de tamaño');
      console.error(err);
    } finally {
      setCreatingSize(false);
    }
  };

  // Submit the update.
  // The FormData now includes:
  // - New images (from formData.images)
  // - A JSON string for removedImageIds (for images the user removed)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('SKU', String(formData.SKU));
      data.append('description', formData.description);
      data.append('price', String(formData.price));
      data.append('stock', String(formData.stock));
      data.append('weight', String(formData.weight));
      data.append('categoryId', String(formData.categoryId));
      data.append('subcategoryId', String(formData.subcategoryId));
      data.append('discountId', String(formData.discountId));
      formData.optionIds.forEach(id => data.append('optionIds', String(id)));
      // Append the removed image IDs (as a JSON string).
      data.append('removedImageIds', JSON.stringify(removedImageIds));
      // Append new images.
      formData.images.forEach(file => data.append('images', file));
      
      await apiServiceProducts.updateProduct(Number(id), data);
      alert('Producto actualizado con éxito');
      router.push('/admin/products');
    } catch (err) {
      setError('Error al actualizar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md">
        <h1 className="text-3xl font-semibold mb-8">Actualizar Producto</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* SKU */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="SKU">SKU *</label>
              <input
                type="number"
                id="SKU"
                name="SKU"
                value={formData.SKU}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Descripción */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Precio */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="price">Precio *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Stock */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Peso */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="weight">Peso *</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="categoryId">Categoría *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleCategoryChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            {/* Subcategoría */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="subcategoryId">Subcategoría</label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId || ''}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar subcategoría</option>
                {subcategories.map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                ))}
              </select>
            </div>
            {/* Imágenes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="images">Imágenes (hasta 10 archivos)</label>
              <input
                type="file"
                id="images"
                onChange={handleImageUpload}
                multiple
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* Display existing images */}
                {existingImages.map((image, index) => (
                  <div key={image.id} className="relative">
                    <img
                      src={getImageUrl(image.url)}
                      alt={`Existing image ${index}`}
                      className="w-full h-32 object-cover border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleExistingImageRemove(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {/* Display new images */}
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New image ${index}`}
                      className="w-full h-32 object-cover border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Opciones (Colores y Tamaños) */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4">Opciones</h2>
              {/* Opciones de color */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Colores</label>
                <MultiSelect
                  value={getSelectedValues(0)}
                  options={transformOptionsForSelect(colorOptions)}
                  onChange={(e) => handleOptionSelect(e.value, 0)}
                  placeholder="Seleccionar colores"
                  className="w-full"
                  display="chip"
                  filter
                  filterPlaceholder='Buscar colores'
                />
              </div>
              {/* Opciones de tamaño */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tamaños</label>
                <div className="flex gap-2">
                  <MultiSelect
                    value={getSelectedValues(1)}
                    options={transformOptionsForSelect(sizeOptions)}
                    onChange={(e) => handleOptionSelect(e.value, 1)}
                    placeholder="Seleccionar tamaños"
                    className="w-full"
                    display="chip"
                  />
                  <div className="flex gap-2 min-w-[300px]">
                    <InputText
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      placeholder="Nuevo tamaño"
                      className="w-full"
                    />
                    <Button
                      type="button"
                      onClick={handleCreateSize}
                      disabled={creatingSize || !newSizeName.trim()}
                      loading={creatingSize}
                      className="bg-green-500 hover:bg-green-600"
                      label="Agregar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
