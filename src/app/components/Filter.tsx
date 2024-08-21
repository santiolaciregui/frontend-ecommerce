'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
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
        <div className="flex items-center gap-2">
          <input type="checkbox" id="cuotas" name="cuotas" className="h-4 w-4" onChange={handleFilterChange} />
          <label htmlFor="cuotas" className="text-sm">Cuotas sin interés</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="simple" name="simple" className="h-4 w-4" onChange={handleFilterChange} />
          <label htmlFor="simple" className="text-sm">Cuota simple</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="manana" name="manana" className="h-4 w-4" onChange={handleFilterChange} />
          <label htmlFor="manana" className="text-sm">Llega mañana</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="inmediato" name="inmediato" className="h-4 w-4" onChange={handleFilterChange} />
          <label htmlFor="inmediato" className="text-sm">Retiro inmediato</label>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Precio</h2>
        <input type="number" name="min" placeholder="Min" className="py-2 px-4 rounded-md text-sm bg-white border" onChange={handleFilterChange} />
        <input type="number" name="max" placeholder="Max" className="py-2 px-4 rounded-md text-sm bg-white border" onChange={handleFilterChange} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Categorías</h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm">
            <input type="checkbox" name="category" value="taladros" className="mr-2" onChange={handleFilterChange} />
            Taladros
          </label>
          <label className="text-sm">
            <input type="checkbox" name="category" value="sierras" className="mr-2" onChange={handleFilterChange} />
            Sierras y Electrosierras
          </label>
          <label className="text-sm">
            <input type="checkbox" name="category" value="electrobombas" className="mr-2" onChange={handleFilterChange} />
            Electrobombas de Agua
          </label>
          <label className="text-sm">
            <input type="checkbox" name="category" value="accesorios" className="mr-2" onChange={handleFilterChange} />
            Accesorios y Repuestos
          </label>
          <label className="text-sm">
            <input type="checkbox" name="category" value="amoladoras" className="mr-2" onChange={handleFilterChange} />
            Amoladoras
          </label>
          <label className="text-sm">
            <input type="checkbox" name="category" value="lijadoras" className="mr-2" onChange={handleFilterChange} />
            Lijadoras
          </label>
          <label className="text-sm">
            <input type="checkbox" name="category" value="compresores" className="mr-2" onChange={handleFilterChange} />
            Compresores
          </label>
          <label className="text-sm">
            <input type="checkbox" name="category" value="rotomartillos" className="mr-2" onChange={handleFilterChange} />
            Rotomartillos
          </label>
          <label className="text-sm">
            <input type="checkbox" name="category" value="soldadoras" className="mr-2" onChange={handleFilterChange} />
            Soldadoras
          </label>
        </div>
      </div>
    </div>
  );
}

export default Filter;
