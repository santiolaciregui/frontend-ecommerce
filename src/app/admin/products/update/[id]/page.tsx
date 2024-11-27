'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiServiceProducts from "../../../../pages/api/products";
import apiServiceCategories from "../../../../pages/api/category";
import apiServiceOptions from "../../../../pages/api/options";
import apiServiceDiscount from "../../../../pages/api/discount";
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

const UpdateProduct = () => {
  const { id } = useParams(); // Usamos useParams para obtener el 'id'
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
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
    const fetchProductData = async () => {
      try {
        const product = await apiServiceProducts.fetchProductByID({ id: Number(id) });
        setFormData({
          name: product.name,
          SKU: product.SKU,
          description: product.description,
          price: product.price,
          stock: product.stock,
          weight: product.weight,
          categoryId: 13, // Usamos productCategory
          subcategoryId: 1,
          discountId: product.discountId,
          optionIds: product.Options.map(option => option.id),
          images: [], // Las imágenes deben ser cargadas de otra manera
        });
        console.log("categoryID:"+product.categoryId);
        console.log(JSON.stringify(product, null, 2));
        const fetchedCategories = await apiServiceCategories.fetchParentCategories();
        setCategories(fetchedCategories);

        const fetchedOptions = await apiServiceOptions.fetchOptions();
        setOptions(fetchedOptions);

        const fetchedDiscounts = await apiServiceDiscount.fetchDiscounts();
        setDiscounts(fetchedDiscounts);
      } catch (err) {
        setError('Error al cargar los datos del producto');
        console.error(err);
      }
    };

    if (id) fetchProductData();
  }, [id]);

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
    if (e.target.files) {
      setFormData(prevState => ({ ...prevState, images: [...e.target.files] }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prevState => {
      const newImages = [...prevState.images];
      newImages.splice(index, 1);
      return { ...prevState, images: newImages };
    });
  };

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
      formData.optionIds.forEach(id => data.append('optionIds', String(id)));
      formData.images.forEach(file => data.append('images', file));
      console.log("aca si entre");
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
              <label className="block text-sm font-medium mb-1" htmlFor="subcategoryId">Subcategoría</label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium mb-1" htmlFor="options">Opciones *</label>
            <div className="space-y-2">
              {options.map(option => (
                <div key={option.id}>
                  <input
                    type="checkbox"
                    id={`option-${option.id}`}
                    name="options"
                    value={option.id}
                    checked={formData.optionIds.includes(option.id)}
                    onChange={() => handleOptionChange(option.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`option-${option.id}`} className="text-sm">{option.name}</label>
                </div>
              ))}
            </div>
          </div>

            <div>
              <label className="block text-sm font-medium mb-1">Imágenes</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-sm">{image.name}</span>
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="ml-2 text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
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
