'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import orderService from '../pages/api/order';
import { FaSearch } from 'react-icons/fa'; // Font Awesome

const SeguimientoPedido: React.FC = () => {
  const [numeroPedido, setNumeroPedido] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      // Busca las órdenes por número de orden
      const orden = await orderService.fetchOrderById(numeroPedido);  // Pasa solo el número de orden

      if (orden) {
        const idOrden = orden.id;
        console.log("ID de la orden: " + idOrden);
        router.push(`/order-summary/${idOrden}`);  // Redirige al resumen del pedido
      } else {
        setError('No encontramos un pedido con ese número');
      }
    } catch (err) {
      setError('Hubo un error al buscar tu pedido');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="max-w-lg mx-auto bg-white p-8 shadow-xl rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-green-500 mb-6">Consulta el estado de tu pedido</h2>
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium">Número de pedido</label>
            <input
              type="text"
              value={numeroPedido}
              onChange={(e) => setNumeroPedido(e.target.value)}
              className="w-full p-3 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ingresa tu número de pedido"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <FaSearch className="text-xl" />
            <span>Buscar</span>
          </button>
        </form>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {cargando && <p className="text-center text-gray-600">Cargando...</p>}
      </div>
    </div>
  );
};

export default SeguimientoPedido;