'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import orderService from '../../pages/api/order';
import Image from 'next/image';

interface OrderDetails {
  id: number;
  orderNumber: string;
  email: string;
  totalAmount: number;
  shippingAddress: string | null;
  paymentFormat: string;
  createdAt: string;
  OrderItems: {
    id: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    options: any[];
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
      Images: { url: string }[]; // Assuming Images is an array of objects with a url property
    };
  }[];
}

const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
            <div key={item.id} className="flex gap-4 items-center">
              <Image
                src={item.Product.Images[0] ? `${API_URL}${item.Product.Images[0].url}` : '/logo-verde-manzana.svg'}
                alt={item.Product.name}
                width={62}
                height={96}
                className="object-cover rounded-md"
              />
              <div className="flex justify-between w-full">
                <div>
                  <span className="font-semibold">{item.Product.name}</span>
                  <span className="text-gray-500 ml-2">x {item.quantity}</span>
                </div>
                <span>${item.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-8 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          onClick={() => router.push('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
