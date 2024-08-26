import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ items }: { items: any }) => {
    const [index, setIndex] = useState(0);
    const API_URL = 'https://backend-ecommerce-aecr.onrender.com';  // Update this URL if your backend is hosted elsewhere
    return (
        <div>
            <div className="h-[500px] relative">
                <Image
                    src={`${API_URL}${items[index]?.url}`} // Usa la URL completa con el host del backend
                    alt={items[index]?.altText || 'Product Image'}
                    fill
                    sizes='50vw'
                    className="object-cover rounded-sm"
                    unoptimized // Desactiva la optimización para usar imágenes desde otra fuente
                />
            </div>
            <div className='flex justify-between gap-4 mt-8'>
                {items && items.map((item: any, i: number) => (
                    <div 
                        className="w-1/4 h-32 relative cursor-pointer"
                        key={item.id}
                        onClick={() => setIndex(i)}>
                        <Image
                            src={`${API_URL}${item.url}`} // Usa la URL completa con el host del backend
                            alt={item.altText || 'Product Thumbnail'}
                            fill
                            sizes='30vw'
                            className="object-cover rounded-sm"
                            unoptimized // Desactiva la optimización para usar imágenes desde otra fuente
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;
