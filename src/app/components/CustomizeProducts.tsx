'use client'
import { useEffect, useState } from 'react';
import { Product, Option } from '../context/types';
import { useCart } from '../context/CartContext';

interface CustomizeProductsProps {
  product: Product;
}

const CustomizeProducts = ({ product }: CustomizeProductsProps) => {
  const { addToCart } = useCart();  
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<Option[]>([]);
  const [stockNumber, setStockNumber] = useState(product.stock); // Manejo de stock local

  useEffect(() => {
    // Aquí harías la solicitud para obtener `options` del producto
    const fetchProductOptions = async () => {
      try {
        setOptions(product.Options!);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchProductOptions();
  }, [product]);

  const handleOptionSelect = (optionType: string, choice: string) => {
    setSelectedOptions((prev) => {
      // Crear un nuevo objeto para selectedOptions
      const updatedOptions = { ...prev };
      
      // Desmarcar cualquier otra opción del mismo tipo
      Object.keys(updatedOptions).forEach(key => {
        if (key === optionType) {
          delete updatedOptions[key];
        }
      });

      // Marcar la nueva opción
      if (prev[optionType] !== choice) {
        updatedOptions[optionType] = choice;
      }

      return updatedOptions;
    });
  };

  const handleQuantity = (type: 'i' | 'd') => {
    if (type === 'd' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === 'i' && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    // Creamos un CartItem basado en el producto y las opciones seleccionadas
    const cartItem = {
      product,
      variantId: Object.values(selectedOptions).join('-'), // Creamos un ID de variante basado en las opciones seleccionadas
      quantity
    };

    // Añadimos el CartItem al carrito
    addToCart(cartItem);

    // Actualizamos el stock localmente
    setStockNumber((prevStock) => prevStock - quantity);
    setQuantity(1); // Reiniciamos la cantidad a 1 después de agregar al carrito
  };

  // Agrupar opciones por tipo
  const colorOptions = options.filter(option => option.type === 0);
  const sizeOptions = options.filter(option => option.type === 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Opciones de Color */}
      {colorOptions.length > 0 && (
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Elige un Color</h4>
          <ul className="flex items-center gap-3">
            {colorOptions.map((option) => (
              <li
                key={option.id}
                className="w-8 h-8 rounded-full ring-1 ring-gray-300 relative"
                style={{
                  backgroundColor: option.name,
                  cursor: 'pointer',
                  boxShadow: selectedOptions[option.name] === option.name ? '0 0 0 2px #000' : ''
                }}
                onClick={() => handleOptionSelect('Color', option.name)}
              >
                {selectedOptions['Color'] === option.name && (
                  <div className='absolute w-10 h-10 rounded-full ring-2 ring-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Opciones de Tamaño */}
      {sizeOptions.length > 0 && (
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Elige un Tamaño</h4>
          <ul className="flex items-center gap-3">
            {sizeOptions.map((option) => (
              <li
                key={option.id}
                className="ring-1 ring-green-400 rounded-md py-1 px-4 text-sm cursor-pointer"
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedOptions['Size'] === option.name ? '#4ade80' : 'white',
                  color: selectedOptions['Size'] === option.name ? 'white' : '#4ade80',
                }}
                onClick={() => handleOptionSelect('Size', option.name)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h4 className="font-medium">Cantidad:</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button className="cursor-pointer text-xl" onClick={() => handleQuantity('d')}>
              -
            </button>
            {quantity}
            <button className="cursor-pointer text-xl" onClick={() => handleQuantity('i')}>
              +
            </button>
          </div>
          <div className="">Últimos {stockNumber} productos</div>
        </div>
      </div>

      {/* Botón para agregar al carrito */}
      <button 
        onClick={handleAddToCart} 
        className="rounded-md py-3 px-4 bg-green-500 text-white"
        disabled={quantity > stockNumber || stockNumber === 0} // Deshabilitar si no hay suficiente stock
      >
        Agregar al carrito
      </button>
    </div>
  )
};

export default CustomizeProducts;
