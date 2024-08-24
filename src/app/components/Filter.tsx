'use client'
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchCategories } from '../pages/api/category';
import { Category } from "../context/types";

const Filter = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'category') {
      if (checked) {
        setSelectedCategories(prev => [...prev, value]);
      } else {
        setSelectedCategories(prev => prev.filter(cat => cat !== value));
      }
    }
    
    const params = new URLSearchParams(searchParams);
    if (name === 'category') {
      params.set('categories', selectedCategories.join(','));
    } else {
      params.set(name, value);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className='mt-12 flex flex-col gap-6 p-4 bg-gray-100 rounded-lg'>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Ordenar por</h2>
        <select name="sort" className="py-2 px-4 rounded-md text-sm bg-white" onChange={handleFilterChange}>
          <option>Más relevantes</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
        </select>
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Formas de pago</h2>
        {/* Otros filtros de pago */}
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Precio</h2>
        <input type="number" name="min" placeholder="Min" className="py-2 px-4 rounded-md text-sm bg-white border" onChange={handleFilterChange} />
        <input type="number" name="max" placeholder="Max" className="py-2 px-4 rounded-md text-sm bg-white border" onChange={handleFilterChange} />
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Categorías</h2>
        <div className="flex flex-col gap-1">
          {categories.map(category => (
            <label key={category.id} className="text-sm">
              <input
                type="checkbox"
                name="category"
                value={category.id}
                className="mr-2"
                onChange={handleFilterChange}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Filter;
