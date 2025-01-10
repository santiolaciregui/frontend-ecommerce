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
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
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

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(orderId);
    setError(null);

    try {
      // Match the backend expectation of { id, status }
      await orderService.updateOrderById(orderId, {
        id: orderId,
        status: newStatus
      });
      
      // Update local state after successful backend update
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Error actualizando el estado del pedido');
      console.error(err);
    } finally {
      setUpdatingStatus(null);
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
    const cleanNumber = contactInfo.replace(/\s+/g, '');
    const message = encodeURIComponent("¡Hola! Somos Mueblería Verde Manzana, queríamos comentarte que ya recibimos tu pedido y estamos preparando todo para que llegue a tus manos.");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Listado de Órdenes</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

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
              <tbody className="text-gray-700">
                {orders.length > 0 ? (
                  orders.map(order => (
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
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm 
                              ${updatingStatus === order.id ? 'opacity-50' : 'hover:border-blue-500'}
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            disabled={updatingStatus === order.id}
                          >
                            {Object.entries(statusTranslations).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          {updatingStatus === order.id && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              <FaSpinner className="animate-spin text-blue-500" />
                            </div>
                          )}
                        </div>
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
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={7} 
                      className="px-6 py-8 text-center text-gray-500 text-lg"
                    >
                      Aún no hay elementos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;