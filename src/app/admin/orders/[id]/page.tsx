'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import orderService from '../../../pages/api/order';
import { OrdersDetails } from '@/app/context/types';

interface Product {
  id: number;
  SKU: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState<OrdersDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) {
        setError('ID de orden no proporcionado');
        setLoading(false);
        return;
      }

      try {
        const orderDetails = await orderService.fetchOrderById(id);
        if (!orderDetails) {
          setError('Orden no encontrada');
        } else {
          setOrder(orderDetails);
        }
      } catch (err) {
        setError('Error al cargar los detalles de la orden');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">No se encontraron detalles para esta orden.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Fecha no disponible';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold mb-8">Detalles de la Orden</h1>
        
        <div className="space-y-4">
          <p><strong>Número de Orden:</strong> {order.orderNumber}</p>
          <p><strong>Email:</strong> {order.client?.email || order.email || 'No disponible'}</p>
          <p><strong>Contacto:</strong> {order.client?.phone || 'No disponible'}</p>
          <p><strong>Monto Total:</strong> {formatCurrency(order.totalAmount)}</p>
          <p><strong>Dirección de Envío:</strong> {order.shippingAddress || 'Retiro en tienda'}</p>
          <p><strong>Forma de Pago:</strong> {order.paymentFormat}</p>
          <p><strong>Fecha:</strong> {formatDate(order.createdAt)}</p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Productos en la Orden</h2>
        <div className="border rounded-lg overflow-hidden">
          {order.OrderItems.length === 0 ? (
            <p className="p-4 text-gray-500">No hay productos en esta orden</p>
          ) : (
            <div className="divide-y">
              {order.OrderItems.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div className="space-y-1">
                    <p className="font-medium">{item.Product?.name || item.productName}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Precio unitario: {formatCurrency(item.unitPrice)}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => router.push('/admin/orders')}
          >
            Volver al listado de órdenes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;