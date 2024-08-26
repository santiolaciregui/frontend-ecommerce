'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import orderService from '../../pages/api/order';

interface Order {
    id: number;
    orderNumber: string;
    email: string;
    totalAmount: number;
    createdAt: string;
  }

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await orderService.fetchOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        setError('Error fetching orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId: number) => {
    setLoading(true);
    setError(null);

    try {
      await orderService.deleteOrderById(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      setError('Error deleting order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderId: number) => {
    router.push(`/admin/orders/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md">
        <h1 className="text-3xl font-semibold mb-8">Listado de Órdenes</h1>

        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Número de Orden</th>
                <th className="py-2">Email</th>
                <th className="py-2">Monto Total</th>
                <th className="py-2">Fecha</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="py-2">{order.orderNumber}</td>
                  <td className="py-2">{order.email}</td>
                  <td className="py-2">${order.totalAmount}</td>
                  <td className="py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">
                    <button
                      className="text-blue-500 hover:underline mr-4"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(order.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
