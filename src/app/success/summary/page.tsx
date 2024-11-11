'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { fetchOrderById } from '../../pages/api/order'; // Adjust the import path as necessary
import { Order } from '@/app/context/types';

export default function OrderSummary() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const orderId = '11'; // Replace with dynamic order ID as needed
    fetchOrderById(orderId)
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column (2/3 width) */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">ORDEN: #{order?.id}</h2>
          
          {/* Payment Status */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">{order?.status}</h3>
            <p className="text-gray-600 mt-2">¡Hola! ¿Cómo estás?</p>
            <p className="text-gray-600">Recordá que el pago se realiza al momento de retirar el pedido.</p>
            <p className="text-gray-600 font-medium">¡Gracias por tu compra!</p>
          </div>

          <hr className="my-4 border-gray-500"/>

          {/* Pickup Location */}
          <div className="flex items-center mb-6">
            <span className="material-icons text-gray-600 mr-3">store</span>
            <div>
              <h4 className="font-semibold text-gray-700">Retirar en Local Principal</h4>
              <p className="text-gray-600">Lainez 1223 - Atención de Lun. a Vie. de 9 a 18 hs.</p>
            </div>
          </div>
          
          <hr className="my-4 border-gray-500"/>
    
          {/* Order Items */}
          {order?.OrderItems.map(item => (
            <div key={item.id} className="flex items-center mb-6">
              {/* <Image src={item.Product.Images} width={60} height={60} alt={item.Product.name} className="rounded-lg" /> */}
              <div className="ml-4">
                <p className="font-semibold text-gray-700">{item.Product.name} × {item.quantity}</p>
                <p className="text-gray-700">${item.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}

          {/* Store Information Checkbox */}
          <div className="mt-4">
            {/* Help Section */}
          <div className="text-gray-600 text-sm">
            ¿Necesitás ayuda? <a href="/empresa/contacto" className="text-green-600 hover:underline">Comunicate con nosotros</a>
          </div>
          </div>
        </div>
      </div>

      {/* Right Column (1/3 width) */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Summary Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700">Subtotal</h3>
            <p className="text-gray-700">${order?.totalAmount.toFixed(2)}</p>
            <h3 className="font-semibold text-gray-700 mt-2">Costo de envío</h3>
            <p className="text-gray-700">Gratis</p>
            <h3 className="font-bold text-xl text-gray-900 mt-4">Total</h3>
            <p className="text-xl text-gray-900">${order?.totalAmount.toFixed(2)}</p>
          </div>

          {/* Order Tracking */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700">Cómo seguir el pedido</h3>
            <p className="text-gray-600">Te enviamos un email con un link a esta página, para que puedas seguir la entrega de tu compra.</p>
          </div>

          {/* Order Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700">Informaciones del pedido</h3>
            <p className="text-gray-600"><strong>E-MAIL</strong>: {order?.client.email}</p>
            <p className="text-gray-600"><strong>DATOS DE FACTURACIÓN</strong>: Santiago Olaciregui, {order?.shippingAddress}</p>
            <p className="text-gray-600"><strong>PERSONA QUE RETIRARÁ EL PEDIDO</strong>: {order?.client.name}</p>
            <p className="text-gray-600"><strong>FORMA DE ENTREGA</strong>: Retiras en Local Principal</p>
            <p className="text-gray-600"><strong>PEDIDO REALIZADO</strong>: {order?.createdAt}</p>
          </div>

          
        </div>
      </div>
    </div>
  );
}
