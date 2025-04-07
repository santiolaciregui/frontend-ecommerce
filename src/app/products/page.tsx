// app/products/page.tsx
"use client";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import Filter from "../components/Filter";
import ProductList from "../components/ProductList";
import Loading from "../components/Loading";
import { Product, Category } from "../context/types";
import apiService from "../pages/api/products";
import { fetchParentCategories, fetchSubcategoriesByParent } from "../pages/api/category";
import { useSearchParams } from "next/navigation";
export const dynamic = 'force-dynamic';

// Componente para el Filtro en versión móvil
interface MobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const MobileFilter: React.FC<MobileFilterProps> = ({ isOpen, onClose, children }) => {
  // Función para manejar la navegación a la página de productos
  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/products';
    onClose();
  };

  return (
    <div
      className={`
        fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="h-full flex flex-col">
        {/* Header del filtro móvil */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Filtros</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Enlace a Productos sin parámetros */}
        <div className="px-4 py-2 border-b">
          <a href="/products" onClick={handleProductsClick} className="text-blue-600 font-medium">Ver todos los productos</a>
        </div>

        {/* Contenido (el <Filter /> en sí) */}
        <div className="flex-1 overflow-y-auto pb-20">
          {children}
        </div>

        {/* Botón fijo al fondo (opcional) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente interno que usa useSearchParams
const ProductsContent = () => {
  // Control del panel de filtro móvil
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // =========================
  //   Categorías y filtros
  // =========================
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);

  // Estado de los filtros seleccionados
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [filters, setFilters] = useState<{
    parentCategory: number | null;
    subcategory: number | null;
  }>({
    parentCategory: categoryFromUrl ? parseInt(categoryFromUrl) : null,
    subcategory: null,
  });

  // =========================
  //   Productos y paginación
  // =========================
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ref para IntersectionObserver
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // =========================
  //     Efecto: Categorías
  // =========================
  useEffect(() => {
    (async () => {
      try {
        const parentCats = await fetchParentCategories();
        setParentCategories(parentCats);
      } catch (err) {
        console.error("Error al obtener categorías padres:", err);
      }
    })();
  }, []);

  // Cuando cambie la categoría padre, cargamos sus subcategorías
  useEffect(() => {
    if (!filters.parentCategory) {
      setSubcategories([]);
      return;
    }

    (async () => {
      try {
        const subs = await fetchSubcategoriesByParent(filters.parentCategory);
        setSubcategories(subs);
      } catch (err) {
        console.error("Error al obtener subcategorías:", err);
      }
    })();
  }, [filters.parentCategory]);

  // =========================
  //     Efecto: Productos
  // =========================
  useEffect(() => {
    // Si es la primera página (o cambiaron los filtros), reiniciamos
    if (page === 0) {
      setProducts([]);
      setHasMore(true);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const newProducts = await apiService.fetchProducts({
          categoryId: filters.parentCategory,
          subcategoryId: filters.subcategory,
          page,
          // Si tuvieras más filtros (minPrice, maxPrice, etc.),
          // pásalos aquí dentro de searchParams:
          // searchParams: { ... }
        });

        setProducts(prev =>
          page === 0 ? newProducts : [...prev, ...newProducts]
        );

        if (newProducts.length < 9) {
          setHasMore(false);
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, page]);

  // =========================
  //   IntersectionObserver
  // =========================
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading]);

  // =========================
  //   Callbacks de Filtros
  // =========================
  const handleChangeFilters = useCallback(
    (newFilters: { parentCategory: number | null; subcategory: number | null }) => {
      // Al cambiar cualquier filtro, reseteamos la paginación
      setPage(0);
      setFilters(newFilters);
    },
    []
  );

  // Evitar scroll del body cuando el filtro móvil está abierto
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);

  // =========================
  //       Render UI
  // =========================
  // Si está cargando y aún no hay productos, muestra el loader
  if (loading && products.length === 0) {
    return <Loading />;
  }

  return (
    <div className="mt-12 px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 relative">
      {/* Botón para abrir el filtro en móvil */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Panel de filtro móvil */}
      <MobileFilter
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      >
        {/* Inyectamos el mismo <Filter /> que en desktop */}
        <Filter
          parentCategories={parentCategories}
          subcategories={subcategories}
          selectedParentCategory={filters.parentCategory}
          selectedSubcategory={filters.subcategory}
          onChangeFilters={handleChangeFilters}
        />
      </MobileFilter>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filtro en desktop */}
        <div className="hidden md:block md:w-1/4">
          <Filter
            parentCategories={parentCategories}
            subcategories={subcategories}
            selectedParentCategory={filters.parentCategory}
            selectedSubcategory={filters.subcategory}
            onChangeFilters={handleChangeFilters}
          />
        </div>

        {/* Lista de productos */}
        <div className="w-full md:w-3/4">
          {products.length > 0 ? (
            <>
              <ProductList products={products} />
              {/* Sentinel para el infinite scroll */}
              <div ref={loadMoreRef} className="h-10" />
              {loading && (
                <div className="text-center py-4">
                  Cargando más productos...
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600">
                ¡Estamos renovando nuestro catálogo de productos!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente principal que envuelve el componente interno en un Suspense
const ListPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsContent />
    </Suspense>
  );
};

export default ListPage;