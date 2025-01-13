'use client';
import React, { useState, useEffect } from 'react';
import apiServiceProducts from "../../../pages/api/products";
import apiServiceCategories from "../../../pages/api/category";
import apiServiceOptions from "../../../pages/api/options";
import apiServiceDiscount from "../../../pages/api/discount";
import { Category, Discount, Option, Product } from '@/app/context/types';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { redirect } from 'next/navigation';


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
  const [isFormValid, setIsFormValid] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [options, setOptions] = useState<Option[]>([]);

  const [colorOptions, setColorOptions] = useState<Option[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Option[]>([]);
  const [newSizeName, setNewSizeName] = useState('');
  const [creatingSize, setCreatingSize] = useState(false);


  
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
        setColorOptions(fetchedOptions.filter((option: { type: number; }) => option.type === 0));
        setSizeOptions(fetchedOptions.filter((option: { type: number; }) => option.type === 1));

        const fetchedDiscounts = await apiServiceDiscount.fetchDiscounts();
        setDiscounts(fetchedDiscounts);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchInitialData();
  }, []);

  const updateOptionsByType = (allOptions: Option[]) => {
    setColorOptions(allOptions.filter(option => option.type === 0));
    setSizeOptions(allOptions.filter(option => option.type === 1));
  };

  const handleCreateSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSizeName.trim()) return;

    setCreatingSize(true);
    try {
      const newOption = {
        name: newSizeName.trim(),
        type: 1 // Size type
      };

      const createdOption = await apiServiceOptions.createOption(newOption);
      
      // Fetch all options again to ensure we have the correct data structure
      const updatedOptions = await apiServiceOptions.fetchOptions();
      setOptions(updatedOptions);
      updateOptionsByType(updatedOptions);

      // Update formData with the new option ID
      setFormData(prev => ({
        ...prev,
        optionIds: [...prev.optionIds, createdOption.id]
      }));

      setNewSizeName(''); // Clear input
      
    } catch (err) {
      setError('Error creating size option');
      console.error(err);
    } finally {
      setCreatingSize(false);
    }
  };

  const transformOptionsForSelect = (options: Option[]) => {
    return options.map(option => ({
      label: option.name,
      value: option.id
    }));
  };

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData(prevState => ({
        ...prevState,
        images: [...(prevState.images || []), ...Array.from(files)]
      }));
    }
  };

   // Handle option selection for both colors and sizes
   const handleOptionSelect = (selectedIds: number[], type: number) => {
    setFormData(prevState => {
      // Get current options of the other type
      const otherTypeOptions = prevState.optionIds.filter(id => {
        const option = options.find(opt => opt.id === id);
        return option && option.type !== type;
      });

      // Combine with newly selected options
      return {
        ...prevState,
        optionIds: [...otherTypeOptions, ...selectedIds]
      };
    });
  };

  // Get selected values for each MultiSelect
  const getSelectedValues = (type: number) => {
    return formData.optionIds.filter(id => {
      const option = options.find(opt => opt.id === id);
      return option && option.type === type;
    });
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
      console.log(formData)
      const response = await apiServiceProducts.createProduct(data);
      alert(editMode ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
      redirect('/admin/products');
    } catch (err) {
      setError('Error al crear el producto');
      redirect('/admin/products');
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
              <label className="block text-sm font-medium mb-1" htmlFor="image">Imágenes (hasta 10 archivos)</label>
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
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Colores
        </label>
        <MultiSelect
          value={getSelectedValues(0)}
          options={transformOptionsForSelect(colorOptions)}
          onChange={(e) => handleOptionSelect(e.value, 0)}
          placeholder="Seleccionar colores"
          className="w-full"
          display="chip"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tamaños
        </label>
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
        {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
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