// components/Filter.tsx
'use client';
import React, { useCallback } from "react";
import { Category } from "../context/types";

interface FilterProps {
  // Categorías padre cargadas en el padre
  parentCategories: Category[];
  // Subcategorías cargadas según la categoría padre seleccionada
  subcategories: Category[];
  // Categoría padre actualmente seleccionada
  selectedParentCategory: number | null;
  // Subcategoría actualmente seleccionada
  selectedSubcategory: number | null;
  // Callback que notificará al padre cuando cambie algún filtro
  onChangeFilters: (filters: {
    parentCategory: number | null;
    subcategory: number | null;
    // Si manejas rangos de precios u otros filtros, agrégalos aquí
  }) => void;
}

const Filter: React.FC<FilterProps> = ({
  parentCategories,
  subcategories,
  selectedParentCategory,
  selectedSubcategory,
  onChangeFilters,
}) => {
  /**
   * Maneja el clic en una categoría padre.
   * Si ya estaba seleccionada, la deseleccionamos (colocamos null).
   */
  const handleParentCategoryClick = useCallback(
    (categoryId: number) => {
      // Si es la misma categoría, la deseleccionamos
      const newParent = (categoryId === selectedParentCategory) ? null : categoryId;
      // Al cambiar la categoría padre, limpiamos la subcategoría
      onChangeFilters({
        parentCategory: newParent,
        subcategory: null,
      });
    },
    [selectedParentCategory, onChangeFilters]
  );

  /**
   * Maneja el clic en una subcategoría.
   * Si ya estaba seleccionada, la deseleccionamos.
   */
  const handleSubcategoryClick = useCallback(
    (subcategoryId: number) => {
      const newSubcat = (subcategoryId === selectedSubcategory) ? null : subcategoryId;
      onChangeFilters({
        parentCategory: selectedParentCategory,
        subcategory: newSubcat,
      });
    },
    [selectedParentCategory, selectedSubcategory, onChangeFilters]
  );

  return (
    <div className="mt-12 flex flex-col gap-6 p-4 bg-gray-100 rounded-lg">
      {/* Listado de categorías padre */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Categorías</h2>
        <div className="flex flex-col gap-2">
          {parentCategories.map((parent) => (
            <div key={parent.id}>
              {/* Nombre de la categoría padre */}
              <div
                className={`cursor-pointer text-sm ${
                  selectedParentCategory === parent.id ? "font-bold" : ""
                }`}
                onClick={() => handleParentCategoryClick(parent.id)}
              >
                {parent.name}
              </div>

              {/* Si la categoría padre está seleccionada, mostramos sus subcategorías */}
              {selectedParentCategory === parent.id && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  {subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className={`cursor-pointer text-xs ${
                        selectedSubcategory === subcategory.id ? "font-bold" : ""
                      }`}
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

      {/* 
        Si manejaras rangos de precios, aquí irían los inputs 
        Ejemplo:
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">Precio</h2>
          <input
            type="number"
            placeholder="Mínimo"
            // onChange={...}
          />
          <input
            type="number"
            placeholder="Máximo"
            // onChange={...}
          />
        </div>
      */}
    </div>
  );
};

export default Filter;
