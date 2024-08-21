import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"

const FilterClient = () => {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleFilterChange = ( 
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement> 
    ) => {
        const { name, value } = e.target;
        const params = new URLSearchParams(searchParams);
        params.set(name, value);
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className='mt-12 flex justify-between'>
            <div className="flex gap-6">
                <select name="category" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]" onChange={handleFilterChange}>
                    <option value="">Categoria</option>
                    <option value="physical">Fisica</option>
                    <option value="digital">Digital</option>
                </select>
                <input type="text" name='min' placeholder="min_price" className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gay-400" onChange={handleFilterChange} />
                <input type="text" name='max' placeholder="max_price" className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gay-400" onChange={handleFilterChange} />
                <select name="color" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]" onChange={handleFilterChange}>
                    <option value="">Color</option>
                    <option value="">Type</option>
                    <option value="">Type</option>
                </select>
            </div>
            <div className="">
                <select
                    name="sort"
                    id=""
                    className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400"
                    onChange={handleFilterChange}
                >
                    <option>Ordenar por</option>
                    <option value="asc price">Precio: Menor a Mayor</option>
                    <option value="desc price">Precio: Mayor a Menor</option>
                    <option value="asc alphabetic">Alfabeticamente: ascendente</option>
                    <option value="desc alphabetic">Alfabeticamente: descendente</option>
                    <option value="best sellers">Mas Vendidos</option>
                </select>
            </div>
        </div>
    )
}

export default FilterClient;
