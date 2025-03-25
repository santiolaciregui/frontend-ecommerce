'use client';
import React, { useState, useEffect } from 'react';
import apiServiceProducts from "../../../pages/api/products";
import apiServiceCategories from "../../../pages/api/category";
import apiServiceOptions from "../../../pages/api/options";
import apiServiceDiscount from "../../../pages/api/discount";

import { Category, Discount, Option } from '@/app/context/types';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';  // <-- IMPORT DROPDOWN
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useRouter } from 'next/navigation';
import BackButton from '@/app/components/BackButton';

/** Product form data without the images (we'll handle images separately) */
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
}

/** We keep track of each uploaded image in an array:
 *  { file: File; colorId?: number } 
 *  colorId is optional if the user doesn't want to associate it with a color.
 */
interface UploadedImage {
  file: File;
  colorId?: number;  // which color this image belongs to, if any
}

const CreateProduct = () => {
  const router = useRouter();

  // Basic form data
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
  });

  // We'll store all images (generic or color-specific) in this single array
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // Category, subcategory, discount, option data from your APIs
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [options, setOptions] = useState<Option[]>([]);

  // We'll separate color and size options from the full list
  const [colorOptions, setColorOptions] = useState<Option[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Option[]>([]);

  // State for dynamically creating a size
  const [newSizeName, setNewSizeName] = useState('');
  const [creatingSize, setCreatingSize] = useState(false);

  // Errors & loading states
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // For future use if you have an edit mode
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Categories
        const fetchedCategories = await apiServiceCategories.fetchParentCategories();
        setCategories(fetchedCategories);

        // Options
        const fetchedOptions = await apiServiceOptions.fetchOptions();
        setOptions(fetchedOptions);

        // Separate them
        setColorOptions(fetchedOptions.filter((o: Option) => o.type === 0));
        setSizeOptions(fetchedOptions.filter((o: Option) => o.type === 1));

        // Discounts
        const fetchedDiscounts = await apiServiceDiscount.fetchDiscounts();
        setDiscounts(fetchedDiscounts);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  /** If we create a new size, we refresh the list of options and push the new size to formData.optionIds. */
  const handleCreateSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSizeName.trim()) return;

    setCreatingSize(true);
    try {
      const newOptionData = {
        name: newSizeName.trim(),
        type: 1, // 'size'
      };
      const createdOption = await apiServiceOptions.createOption(newOptionData);

      // Refresh all options from DB
      const updatedOptions = await apiServiceOptions.fetchOptions();
      setOptions(updatedOptions);
      setColorOptions(updatedOptions.filter((o: Option) => o.type === 0));
      setSizeOptions(updatedOptions.filter((o: Option) => o.type === 1));

      // Add newly created size ID to formData.optionIds
      setFormData(prev => ({
        ...prev,
        optionIds: [...prev.optionIds, createdOption.id],
      }));

      setNewSizeName('');
    } catch (err) {
      setError('Error creating size option');
      console.error(err);
    } finally {
      setCreatingSize(false);
    }
  };

  // Helper to transform Option[] => prime MultiSelect format
  const transformOptionsForSelect = (options: Option[]) => {
    return options.map(option => ({
      label: option.name,
      value: option.id,
    }));
  };

  // For basic text/select inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // When user picks category, we fill subcategories
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      categoryId,
      subcategoryId: 0,
    }));
    // find subcategories
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      setSubcategories(selectedCategory.subcategories || []);
    } else {
      setSubcategories([]);
    }
  };

  // For picking color or size Options in the MultiSelect
  const handleOptionSelect = (selectedIds: number[], type: number) => {
    setFormData(prevState => {
      // keep only IDs from the other type
      const otherTypeOptions = prevState.optionIds.filter((id) => {
        const opt = options.find(o => o.id === id);
        return opt && opt.type !== type;
      });
      // combine those with new ones
      return { ...prevState, optionIds: [...otherTypeOptions, ...selectedIds] };
    });
  };

  // Returns only the selected color or size IDs from formData
  const getSelectedValues = (type: number) => {
    return formData.optionIds.filter((id) => {
      const opt = options.find(o => o.id === id);
      return opt && opt.type === type;
    });
  };

  /**
   * SINGLE file input for all product images.
   * We store them in `uploadedImages`, each with an optional colorId (null by default).
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      colorId: undefined, // no color assigned initially
    }));
    setUploadedImages(prev => [...prev, ...newFiles]);
  };

  /** Remove an image from `uploadedImages` */
  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  /** Let the user pick a color for each image. If colorId=0 => no color. */
  const handleSetColorForImage = (imageIndex: number, colorId: number | undefined) => {
    setUploadedImages(prev => {
      const updated = [...prev];
      updated[imageIndex] = { ...updated[imageIndex], colorId };
      return updated;
    });
  };

  // Custom template to show a circle + color name
  // If your color options don’t have an actual color code (e.g. hexCode),
  // adjust or remove the circle logic as needed.
  const colorOptionTemplate = (option: Option) => {
    if (!option || !option.name) {
      return <span>Sin color específico</span>;
    }
    return (
      <div className="flex items-center">
        <span
          style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            // Adjust the property if you store color differently, e.g. option.hexCode
            backgroundColor: (option as any).colorCode || '#ccc',
            marginRight: '8px',
            border: '1px solid #ccc',
          }}
        />
        <span>{option.name}</span>
      </div>
    );
  };

  /** Final submit with all data: normal fields + images + color assignment. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();

      // Basic product fields
      data.append('name', formData.name);
      data.append('SKU', String(formData.SKU));
      data.append('description', formData.description);
      data.append('price', String(formData.price));
      data.append('stock', String(formData.stock));
      data.append('weight', String(formData.weight));
      data.append('categoryId', String(formData.categoryId));
      data.append('subcategoryId', String(formData.subcategoryId));

      // Options: color + size
      formData.optionIds.forEach((id) => data.append('optionIds', String(id)));

      /**
       * Append each uploaded image. We'll store its color ID in a separate field
       * so the backend knows which color is associated with the file (if any).
       */
      uploadedImages.forEach((img, index) => {
        data.append('images', img.file, img.file.name);
        const cId = img.colorId ?? 0; 
        data.append('imageColorIds', String(cId));
      });

      // Send to your backend
      await apiServiceProducts.createProduct(data);
      alert(editMode ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
      router.push('/admin/products');
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
        <BackButton destination="/admin/products" />
        <h1 className="text-3xl font-semibold mb-8">
          {editMode ? 'Editar Producto' : 'Crear Producto'}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Basic product fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SKU */}
            <div>
              <label htmlFor="SKU" className="block text-sm font-medium mb-1">
                SKU *
              </label>
              <input
                type="text"
                id="SKU"
                name="SKU"
                value={formData.SKU}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Precio *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-1">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium mb-1">
                Peso *
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
                Categoría *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleCategoryChange}
                required
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label htmlFor="subcategoryId" className="block text-sm font-medium mb-1">
                Subcategoría *
              </label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleInputChange}
                required
                disabled={!formData.categoryId}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar subcategoría</option>
                {subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Single file input for all images */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2" htmlFor="allImages">
              Imágenes (asignar color después)
            </label>
            <input
              type="file"
              id="allImages"
              multiple
              onChange={handleFileInputChange}
              className="border p-2 rounded-md"
            />
          </div>

          {/* Display each uploaded file with a color dropdown */}
          {uploadedImages.length > 0 && (
            <div className="mt-4 space-y-4">
              {uploadedImages.map((imgObj, index) => {
                const previewUrl = URL.createObjectURL(imgObj.file);
                return (
                  <div
                    key={index}
                    className="p-4 border rounded-md flex items-start gap-4 relative"
                  >
                    <img
                      src={previewUrl}
                      alt={`Uploaded ${index}`}
                      className="w-24 h-24 object-cover border rounded-md"
                    />
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Asignar color (opcional)
                      </label>
                      <Dropdown
                        value={imgObj.colorId ?? null}
                        options={colorOptions}
                        onChange={(e) => {
                          // e.value is the 'id' if optionValue="id"
                          const newColorId = e.value || 0;
                          handleSetColorForImage(index, newColorId === 0 ? undefined : newColorId);
                        }}
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Sin color específico"
                        className="border p-2 rounded-md w-full md:w-60"
                        itemTemplate={colorOptionTemplate}
                        valueTemplate={colorOptionTemplate}
                      />
                    </div>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveUploadedImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* COLOR & SIZE MULTISELECTS */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Opciones de tamaño</h2>

            {/* Size MultiSelect + "create new size" UI */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tamaños
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <MultiSelect
                  value={getSelectedValues(1)} // size IDs
                  options={transformOptionsForSelect(sizeOptions)}
                  onChange={(e) => handleOptionSelect(e.value, 1)}
                  placeholder="Seleccionar tamaños"
                  className="min-w-[220px]"
                  display="chip"
                />
                <div className="flex gap-2 items-center">
                  <InputText
                    value={newSizeName}
                    onChange={(e) => setNewSizeName(e.target.value)}
                    placeholder="Nuevo tamaño"
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

          {/* SUBMIT */}
          <div className="mt-6">
            <Button
              type="submit"
              disabled={loading}
              label={editMode ? 'Actualizar Producto' : 'Crear Producto'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
