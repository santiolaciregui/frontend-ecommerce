'use client'
import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchParentCategories, fetchSubcategoriesByParent } from '../pages/api/category';
import { fetchProducts } from '../pages/api/products';
import { Category, Product } from "../context/types";

interface FilterProps {
  onProductsFetched: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
}

const Filter: React.FC<FilterProps> = ({ onProductsFetched, setLoading }) => {
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const loadParentCategories = useCallback(async () => {
    try {
      const parentCategoriesData = await fetchParentCategories();
      setParentCategories(parentCategoriesData);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
    }
  }, []);

  useEffect(() => {
    loadParentCategories();
  }, [loadParentCategories]);

  const handleParentCategoryClick = useCallback(async (categoryId: number) => {
    const newSelectedParentCategory = categoryId === selectedParentCategory ? null : categoryId;
    setSelectedParentCategory(newSelectedParentCategory);
    setSelectedSubcategory(null);
    setLoading(true);
  
    try {
      const products = await fetchProducts({
        categoryId: newSelectedParentCategory,
        subcategoryId: null
      });
      if (newSelectedParentCategory !== null) {
        const subcategoriesData = await fetchSubcategoriesByParent(newSelectedParentCategory);
        setSubcategories(subcategoriesData);
      } else {
        setSubcategories([]);
      }
      onProductsFetched(products);
    } catch (error) {
      console.error('Error handling parent category click:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedParentCategory, onProductsFetched, setLoading]);
  
  const handleSubcategoryClick = useCallback(async (subcategoryId: number) => {
    const newSelectedSubcategory = subcategoryId === selectedSubcategory ? null : subcategoryId;
    setSelectedSubcategory(newSelectedSubcategory);
    setLoading(true);
  
    try {
      const products = await fetchProducts({
        categoryId: selectedParentCategory,
        subcategoryId: newSelectedSubcategory
      });
      onProductsFetched(products);
    } catch (error) {
      console.error('Error handling subcategory click:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSubcategory, selectedParentCategory, onProductsFetched, setLoading]);
  
  const handlePriceChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'min') setMinPrice(value);
    if (name === 'max') setMaxPrice(value);
  
    setLoading(true);
  
    try {
      const products = await fetchProducts({
        categoryId: selectedParentCategory,
        subcategoryId: selectedSubcategory,
        searchParams: { minPrice: minPrice, maxPrice: maxPrice }
      });
      onProductsFetched(products);
    } catch (error) {
      console.error('Error fetching products with price filter:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, pathname, replace, selectedSubcategory, selectedParentCategory, minPrice, maxPrice, onProductsFetched, setLoading]);
  return (
    <div className='mt-12 flex flex-col gap-6 p-4 bg-gray-100 rounded-lg'>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Categorías</h2>
        <div className="flex flex-col gap-2">
          {parentCategories.map(parent => (
            <div key={parent.id}>
              <div
                className={`cursor-pointer ${selectedParentCategory === parent.id ? 'font-bold' : ''}`}
                onClick={() => handleParentCategoryClick(parent.id)}
              >
                {parent.name}
              </div>
              {/* Mostrar subcategorías cuando la categoría padre está seleccionada */}
              {selectedParentCategory === parent.id && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  {subcategories.map(subcategory => (
                    <div
                      key={subcategory.id}
                      className={`cursor-pointer ${selectedSubcategory === subcategory.id ? 'font-bold' : ''}`}
                      onClick={() => handleSubcategoryClick(subcategory.id)}
                    >
                      {subcategory.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Precio</h2>
        <input
          type="number"
          name="min"
          placeholder="Min"
          value={minPrice}
          className="py-2 px-4 rounded-md text-sm bg-white border"
          onChange={handlePriceChange}
        />
        <input
          type="number"
          name="max"
          placeholder="Max"
          value={maxPrice}
          className="py-2 px-4 rounded-md text-sm bg-white border"
          onChange={handlePriceChange}
        />
      </div>
    </div>
  );
}

export default Filter;
