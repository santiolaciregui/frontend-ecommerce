'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import orderService from '../../pages/api/order';
import Image from 'next/image';
import { Clock, ShoppingCart, Mail, User } from 'lucide-react';

interface OrderDetails {
  id: number;
  orderNumber: string;
  client: {
    email: string
    firstName: string
    lastName: string
    phone: number
  }
  totalAmount: number;
  shippingAddress: string | null;
  deliveryOption: { option: string; storeId?: string };  paymentFormat: string;
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

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  zip: string;
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
        console.log('orderDestils:', orderDetails)
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
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-500">ORDEN: #{order.id}</p>
        </div>

        {/* Payment Status */}
        <div className="border-b pb-6 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="text-xl" />
            <h1 className="text-2xl font-bold">En espera de pago</h1>
          </div>
          <p className="text-sm text-gray-600">¡Hola! ¿Cómo estás?</p>
          <p className="text-sm text-gray-600 mt-2">
            Recordá que el pago se realiza al momento de retirar el pedido.
          </p>
          <p className="text-sm text-gray-600 mt-2 font-semibold">
            ¡Gracias por tu compra!
          </p>
        </div>

        {/* Pickup Information */}
        <div className="flex items-center mb-6">
          <ShoppingCart className="text-2xl" />
          <div className="ml-2">
            <h2 className="text-lg font-semibold">Retirar en Local Principal</h2>
            <p className="text-sm text-gray-600">
              Lainez 1223 - Atención de Lun. a Vie. de 9 a 18 hs.
            </p>
          </div>
        </div>

        {/* 
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <User className="text-lg" />
            <h2 className="text-lg font-semibold">Guardar mi información para la próxima compra</h2>
          </div>
          <p className="text-sm text-gray-600">
            Tu email es:{" "}
            <span className="font-bold text-black">{order.client.email}</span>
          </p>
          <div className="flex items-center mt-4 space-x-2">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Crear cuenta
            </button>
          </div>
        </div> */}

        {/* Order Details */}
        <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <h3 className="font-semibold mb-4 text-lg text-gray-800 flex items-center space-x-3">
              <Mail className="text-blue-500" />
              <span>Cómo seguir el pedido</span>
            </h3>
            <p className="text-gray-600 mb-6">
              Podes seguir el estado de tu pedido utilizando el número de seguimiento que acabamos de enviarte por correo electrónico.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => window.location.href = '/order-tracking'}
                className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md transform transition-all hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              >
                Ir a seguimiento
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <h3 className="font-semibold mb-4 text-lg text-gray-800 flex items-center space-x-3">
              <ShoppingCart className="text-green-500" />
              <span>Informaciones del pedido</span>
            </h3>
            <p className="text-gray-700">
              <strong>E-MAIL</strong>
              <br />
              <span className="text-gray-600">{order.client.email}</span>
            </p>
            <p className="mt-4 text-gray-700">
              <strong>DATOS DE FACTURACIÓN</strong>
              <br />
              <span className="text-gray-600">{order.client.firstName} {order.client.lastName}</span>
              <br />
              <span className="text-gray-600">Holdich 42, CP 8000</span>
              <br />
              <span className="text-gray-600">Bahía Blanca, Buenos Aires</span>
            </p>
            <p className="mt-4 text-gray-700">
              <strong>FORMA DE ENTREGA</strong>
              <br />
              <span className="text-gray-600">Retiras en Local Principal</span>
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-white p-6 border rounded-lg shadow-lg transition-all hover:shadow-xl">
          {order.OrderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b hover:bg-gray-50 transition duration-300">
              <div className="flex items-center space-x-4">
                <Image
                  src={item.Product.Images[0] ? `${API_URL}${item.Product.Images[0].url}` : '/logo-verde-manzana.svg'}
                  alt={''}
                  width={62}
                  height={96}
                  className="object-cover rounded-md"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {item.Product.name} ({item.options ? JSON.stringify(item.options) : "N/A"}) × {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-lg text-gray-800">${item.totalPrice.toFixed(2)}</p>
            </div>
          ))}
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex justify-between border-b pb-2">
              <p>Subtotal</p>
              <p>${order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p>Costo de envío</p>
              <p className="text-green-600 font-medium">Gratis</p>
            </div>
          </div>
          <div className="border-t mt-6 pt-4 flex justify-between items-center">
            <p className="font-semibold text-xl text-gray-800">Total</p>
            <p className="font-semibold text-xl text-gray-900">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-500">
          <p className="flex items-center space-x-2">
            <span>❓</span>
            <span>
              ¿Necesitás ayuda?{" "}
              <a
                href="/empresa/contacto"
                className="font-semibold text-gray-800 hover:underline"
              >
                Comunicate con nosotros
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );


};

export default OrderDetails;
