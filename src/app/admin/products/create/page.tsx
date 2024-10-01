'use client';
import React, { useState, useEffect } from 'react';
import apiServiceProducts from "../../../pages/api/products";
import apiServiceCategories from "../../../pages/api/category";
import apiServiceOptions from "../../../pages/api/options";
import apiServiceDiscount from "../../../pages/api/discount";
import { Category, Discount, Option, Product } from '@/app/context/types';

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
  images: File[];
}

const CreateProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [options, setOptions] = useState<Option[]>([]);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
    images: [],
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedCategories = await apiServiceCategories.fetchParentCategories();
        setCategories(fetchedCategories);

        const fetchedOptions = await apiServiceOptions.fetchOptions();
        setOptions(fetchedOptions);

        const fetchedDiscounts = await apiServiceDiscount.fetchDiscounts();
        setDiscounts(fetchedDiscounts);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prevState => ({ ...prevState, categoryId: parseInt(value), subcategoryId: 0 }));

    const selectedCategory = categories.find(category => category.id === parseInt(value));
    if (selectedCategory) {
      setSubcategories(selectedCategory.subcategories || []);
    } else {
      setSubcategories([]);
    }
  };

  const handleOptionChange = (optionId: number) => {
    setFormData(prevState => {
      const selectedOptions = prevState.optionIds.includes(optionId)
        ? prevState.optionIds.filter(id => id !== optionId)
        : [...prevState.optionIds, optionId];
      return { ...prevState, optionIds: selectedOptions };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData(prevState => ({
        ...prevState,
        images: [...(prevState.images || []), ...Array.from(files)]
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      images: prevState.images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      console.log(formData);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('SKU', String(formData.SKU));
      data.append('description', formData.description);
      data.append('price', String(formData.price));
      data.append('stock', String(formData.stock));
      data.append('weight', String(formData.weight));
      data.append('categoryId', String(formData.categoryId));
      data.append('subcategoryId', String(formData.subcategoryId));
      formData.optionIds.forEach((id) => data.append('optionIds', String(id)));
      formData.images.forEach((file) => data.append('images', file));
  
      const response = await apiServiceProducts.createProduct(data);
      alert(editMode ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
    } catch (err) {
      setError('Error al crear el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md">
        <h1 className="text-3xl font-semibold mb-8">
          {editMode ? 'Editar Producto' : 'Crear Producto'}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="sku">SKU *</label>
              <input
                type="text"
                id="SKU"
                name="SKU"
                value={formData.SKU}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="categoryId">Categoría *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
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

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="subcategoryId">Subcategoría *</label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.categoryId}
              >
                <option value="">Seleccionar subcategoría</option>
                {subcategories.map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="discountId">Descuento</label>
              <select
                id="discountId"
                name="discountId"
                value={formData.discountId}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar descuento</option>
                {discounts.map(discount => (
                  <option key={discount.id} value={discount.id}>{discount.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="image">Imágenes</label>
              <input
                type="file"
                id="images"
                onChange={handleImageUpload}
                multiple
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                {formData.images?.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
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

            <div className="col-span-2">
  <h2 className="text-xl font-semibold mb-4">Opciones</h2>

  {/* Color Options */}
  <div className="mb-4">
    <h3 className="text-lg font-medium mb-2">Colores:</h3>
    {options.filter(option => option.type === 0).map(option => (
      <div key={option.id} className="flex items-center space-x-4 mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            value={option.id}
            checked={formData.optionIds?.includes(option.id)}
            onChange={() => handleOptionChange(option.id)}
            className="form-checkbox"
          />
          <span className="ml-2 flex items-center">
            <span
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: option.name }} // Display color as background
            />
            {option.name}
          </span>
        </label>
      </div>
    ))}
  </div>

  {/* Size Options */}
  <div>
    <h3 className="text-lg font-medium mb-2">Tamaños:</h3>
    {options.filter(option => option.type === 1).map(option => (
      <div key={option.id} className="flex items-center space-x-4 mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            value={option.id}
            checked={formData.optionIds?.includes(option.id)}
            onChange={() => handleOptionChange(option.id)}
            className="form-checkbox"
          />
          <span className="ml-2">{option.name}</span>
        </label>
      </div>
    ))}
  </div>
</div>

          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editMode ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;