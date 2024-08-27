'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import orderService from '../../../pages/api/order';

interface OrderDetails {
  id: number;
  orderNumber: string;
  email: string;
  totalAmount: number;
  shippingAddress: string | null;
  paymentFormat: string;
  createdAt: string;
  OrderItems: {
      id: number;  // This is directly within the OrderItems array based on your JSON
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      options: any[];  // Depending on the structure, you can define a more specific type
      createdAt: string;
      updatedAt: string;
      orderId: number;
      productId: number;
      Product: {
          id: number;
          SKU: number;
          name: string;
          description: string;
          price: number;
          stock: number;
          weight: number;
          createdAt: string;
          updatedAt: string;
      };
  }[];
}


const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const orderDetails = await orderService.fetchOrderById(id);
        setOrder(orderDetails);
      } catch (err) {
        setError('Error fetching order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>No se encontraron detalles para esta orden.</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md">
        <h1 className="text-3xl font-semibold mb-8">Detalles de la Orden</h1>
        <p className="mb-4"><strong>Número de Orden:</strong> {order.orderNumber}</p>
        <p className="mb-4"><strong>Email:</strong> {order.email}</p>
        <p className="mb-4"><strong>Monto Total:</strong> ${order.totalAmount}</p>
        <p className="mb-4"><strong>Dirección de Envío:</strong> {order.shippingAddress || 'Retiro en tienda'}</p>
        <p className="mb-4"><strong>Forma de Pago:</strong> {order.paymentFormat}</p>
        <p className="mb-8"><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

        <h2 className="text-2xl font-semibold mb-4">Productos en la Orden</h2>
        <div className="border p-4 rounded-md space-y-4">
          {order.OrderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <span>{item.Product.name}</span>
                <span className="text-gray-500 ml-2">x {item.quantity}</span>
              </div>
              <span>${item.totalPrice}</span>
            </div>
          ))}
        </div>
        <button
          className="mt-8 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          onClick={() => router.push('/admin/orders')}
        >
          Volver al listado de órdenes
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
