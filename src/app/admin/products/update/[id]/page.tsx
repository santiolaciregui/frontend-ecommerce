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
import { Dropdown } from 'primereact/dropdown'; // Added Dropdown import
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getImageUrl } from '@/app/utils/getImageURL';
import BackButton from '@/app/components/BackButton';

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
}

// Interface for existing images.
interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  ProductImage: {
    id: number;
    productId: number;
    imageId: number;
    colorId: number | null;
  };
}

// Interface for uploaded images with color assignment
interface UploadedImage {
  file: File;
  colorId?: number;  // which color this image belongs to, if any
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

  // Form data (for text fields)
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
    optionIds: []
  });

  // State for existing images loaded from the product.
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  // State to track which existing image IDs have been removed.
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  // State for new uploaded images with color assignment
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

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
          optionIds: (product.Options as Option[]).map((option: Option) => option.id)
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
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      colorId: undefined, // no color assigned initially
    }));
    setUploadedImages(prev => [...prev, ...newFiles]);
  };

  // Remove a new image before upload.
  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Mark an existing image as removed.
  const handleExistingImageRemove = (imageId: number) => {
    setRemovedImageIds(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(image => image.id !== imageId));
  };

  // Set color for an uploaded image
  const handleSetColorForImage = (imageIndex: number, colorId: number | undefined) => {
    setUploadedImages(prev => {
      const updated = [...prev];
      updated[imageIndex] = { ...updated[imageIndex], colorId };
      return updated;
    });
  };

  // Custom template to show a circle + color name
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
            backgroundColor: (option as any).colorCode || '#ccc',
            marginRight: '8px',
            border: '1px solid #ccc',
          }}
        />
        <span>{option.name}</span>
      </div>
    );
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
      
      // Append option IDs
      formData.optionIds.forEach(id => data.append('optionIds', String(id)));
      
      // Append the removed image IDs (as a JSON string).
      data.append('removedImageIds', JSON.stringify(removedImageIds));
      
      // First collect all color IDs in an array
      const colorIds = uploadedImages.map(img => String(img.colorId ?? 0));
      
      // Append each image file
      uploadedImages.forEach((img, index) => {
        data.append('images', img.file, img.file.name);
      });
      
      // Append color IDs as array elements to ensure they're always sent as an array
      data.append('imageColorIds', JSON.stringify(colorIds));
      
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
        <BackButton destination="/admin/products" />
        <h1 className="text-3xl font-semibold mb-8">Actualizar Producto</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
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
                value={formData.categoryId || ''}
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
                value={formData.subcategoryId || ''}
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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Imágenes Existentes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={getImageUrl(image.url)}
                      alt={image.altText || 'Product Image'}
                      className="w-full h-32 object-cover border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleExistingImageRemove(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      &times;
                    </button>
                    <div className="mt-1 text-xs text-gray-500">
                      {image.ProductImage?.colorId ? 
                        `Color: ${colorOptions.find(c => c.id === image.ProductImage.colorId)?.name || 'Unknown'}` : 
                        'Sin color específico'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Single file input for all new images */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2" htmlFor="allImages">
              Nuevas Imágenes (asignar color después)
            </label>
            <input
              type="file"
              id="allImages"
              multiple
              accept=".png,.jpg,.jpeg"
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
              label="Actualizar Producto"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
