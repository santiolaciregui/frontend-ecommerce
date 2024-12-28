"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import orderService from '../../pages/api/order';
import { FaEye, FaTrashAlt, FaSpinner } from 'react-icons/fa';

interface Order {
  id: number;
  orderNumber: string;
  email: string;
  totalAmount: number;
  createdAt: string;
  status: string;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
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

  const statusTranslations: { [key: string]: string } = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
  };


  const handleWhatsApp = (contactInfo: string) => {
    const cleanNumber = contactInfo.replace(/\s+/g, ''); // Elimina espacios en blanco
    const message = encodeURIComponent("¡Hola! Somos Mueblería Verde Manzana, queríamos comentarte que ya recibimos tu pedido y estamos preparando todo para que llegue a tus manos.");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Listado de Órdenes</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-gray-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-left">Cliente</th>
                  <th className="px-6 py-3 text-left">Contacto</th>
                  <th className="px-6 py-3 text-left">Monto Total</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{order.id}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{order.client.firstName} {order.client.lastName}</td>
                    <td className="px-6 py-4 text-center">
                      {order.client.phone ? (
                        
                        <button
                          className="text-green-500 hover:text-green-700 mx-2"
                          onClick={() => handleWhatsApp(order.client.phone)}
                          title="Enviar mensaje por WhatsApp"
                        >{order.client.phone}
                          <i className="fab fa-whatsapp text-2xl ml-2"></i>
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">${(Math.round(order.totalAmount * 100) / 100).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium capitalize">
                      {statusTranslations[order.status] || order.status}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 mx-2"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        <FaEye className="inline-block" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 mx-2"
                        onClick={() => handleDelete(order.id)}
                      >
                        <FaTrashAlt className="inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
