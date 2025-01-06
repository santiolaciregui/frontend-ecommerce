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

  // Create a function to update URL params
  const updateUrlParams = useCallback((params: { 
    category?: number | null, 
    subcategory?: number | null,
    minPrice?: string,
    maxPrice?: string 
  }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Update or remove category
    if (params.category) {
      current.set('category', params.category.toString());
    } else {
      current.delete('category');
    }

    // Update or remove subcategory
    if (params.subcategory) {
      current.set('subcategory', params.subcategory.toString());
    } else {
      current.delete('subcategory');
    }

    // Update or remove price params
    /* if (params.minPrice) {
      current.set('minPrice', params.minPrice);
    } else {
      current.delete('minPrice');
    }
    
    if (params.maxPrice) {
      current.set('maxPrice', params.maxPrice);
    } else {
      current.delete('maxPrice');
    } */

    const search = current.toString();
    const query = search ? `?${search}` : '';
    replace(`${pathname}${query}`);
  }, [pathname, searchParams, replace]);

  // Load initial state from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const subcategoryFromUrl = searchParams.get('subcategory');
    const minPriceFromUrl = searchParams.get('minPrice');
    const maxPriceFromUrl = searchParams.get('maxPrice');

    const newCategory = categoryFromUrl ? parseInt(categoryFromUrl) : null;
    const newSubcategory = subcategoryFromUrl ? parseInt(subcategoryFromUrl) : null;

    // Only update if values are different to avoid loops
    if (newCategory !== selectedParentCategory) {
      setSelectedParentCategory(newCategory);
      if (newCategory) {
        fetchSubcategoriesByParent(newCategory)
          .then(setSubcategories)
          .catch(console.error);
      }
    }

    if (newSubcategory !== selectedSubcategory) {
      setSelectedSubcategory(newSubcategory);
    }

    if (minPriceFromUrl !== minPrice) {
      setMinPrice(minPriceFromUrl || '');
    }

    if (maxPriceFromUrl !== maxPrice) {
      setMaxPrice(maxPriceFromUrl || '');
    }

    // Fetch products based on URL params
    if (categoryFromUrl || subcategoryFromUrl || minPriceFromUrl || maxPriceFromUrl) {
      setLoading(true);
      fetchProducts({
        categoryId: newCategory,
        subcategoryId: newSubcategory,
        searchParams: {
          minPrice: minPriceFromUrl || undefined,
          maxPrice: maxPriceFromUrl || undefined
        }
      })
        .then(onProductsFetched)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

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
    setLoading(true);

    try {
      // Update URL first
      updateUrlParams({
        category: newSelectedParentCategory,
        subcategory: null,
        minPrice,
        maxPrice
      });

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
  }, [selectedParentCategory, minPrice, maxPrice, updateUrlParams, onProductsFetched, setLoading]);

  const handleSubcategoryClick = useCallback(async (subcategoryId: number) => {
    const newSelectedSubcategory = subcategoryId === selectedSubcategory ? null : subcategoryId;
    setLoading(true);

    try {
      // Update URL first
      updateUrlParams({
        category: selectedParentCategory,
        subcategory: newSelectedSubcategory,
        minPrice,
        maxPrice
      });

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
  }, [selectedSubcategory, selectedParentCategory, minPrice, maxPrice, updateUrlParams, onProductsFetched, setLoading]);

  const handlePriceChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newMinPrice = name === 'min' ? value : minPrice;
    const newMaxPrice = name === 'max' ? value : maxPrice;

    // Update URL with new price values
    updateUrlParams({
      category: selectedParentCategory,
      subcategory: selectedSubcategory,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice
    });
  }, [selectedParentCategory, selectedSubcategory, minPrice, maxPrice, updateUrlParams]);

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
      
      {/* <div className="flex flex-col gap-2">
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
      </div> */}
    </div>
  );
}

export default Filter;