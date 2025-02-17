'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import orderService from '../../pages/api/order';
import Image from 'next/image';
import { Clock, ShoppingCart, Mail, User } from 'lucide-react';
import { fetchStoreById } from '@/app/pages/api/stores';
import { Store } from '@/app/context/types';
import { getImageUrl } from '@/app/utils/getImageURL';

// New status translations with added states
const statusTranslations: { [key: string]: string } = {
  pending: 'Pendiente',
  completed_paid: 'Completado Pagado',
  cancelled: 'Cancelado',
  in_logistics: 'En logística para envío',
  in_transit: 'Tu envío se encuentra en camino',
  ready_for_pickup: 'Listo para retirar en sucursal seleccionada',
  preparing_delivery: 'Preparando producto para su entrega',
  delivered: 'Entregado',
};

interface OrderDetails {
  id: number;
  trackingId: string;
  client: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  totalAmount: number;
  shippingAddress: string | null;
  pickupStoreId: string | null;
  paymentFormat: string;
  // Updated status field to include new states
  status: 'pending' | 'completed_paid' | 'cancelled' | 'in_logistics' | 'in_transit' | 'ready_for_pickup' | 'preparing_delivery' | 'delivered';
  paymentDetails?: {
    provider?: {
      id: number;
      name: string;
    };
    bank?: {
      id: number;
      name: string;
    };
    installments?: {
      id: number;
      numberOfInstallments: number;
      interestRate: number;
      totalInterestRate: number;
    };
  };
  createdAt: string;
  OrderItems: {
    id: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    options: any | null;
    productId: number;
    Product: {
      id: number;
      SKU: number;
      name: string;
      description: string;
      price: number;
      stock: number;
      weight: number;
      Images: { url: string }[];
    };
  }[];
  deliveryOption?: {
    option: 'delivery' | 'pickup';
    address?: string;
  };
}

const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [storeLoading, setStoreLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchOrderAndStoreDetails = async () => {
      setLoading(true);
      try {
        const orderDetails = await orderService.fetchOrderById(id);
        setOrder(orderDetails);

        // If it's a pickup order, fetch store details
        if (orderDetails.pickupStoreId) {
          setStoreLoading(true);
          try {
            const storeData = await fetchStoreById(orderDetails.pickupStoreId);
            setStore(storeData);
          } catch (storeErr) {
            console.error('Error fetching store details:', storeErr);
          } finally {
            setStoreLoading(false);
          }
        }
      } catch (err) {
        setError('Error al cargar los detalles del pedido');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderAndStoreDetails();
    }
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>No se encontraron detalles para esta orden.</p>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryInfo = () => {
    if (order.pickupStoreId === null && order.shippingAddress) {
      return {
        title: 'Envío a domicilio',
        details: order.shippingAddress
      };
    }
    
    if (storeLoading) {
      return {
        title: 'Retiras en Local',
        details: 'Cargando información de la tienda...'
      };
    }
    
    if (store) {
      return {
        title: `Retiras en ${store.name}`,
        details: `${store.address}, ${store.city}`,
        phone: store.phone
      };
    }

    return {
      title: 'Retiras en Local',
      details: 'Información de la tienda no disponible'
    };
  };

  const getPaymentInfo = () => {
    const { paymentFormat, paymentDetails } = order;
  
    switch (paymentFormat) {
      case 'credit_card':
        return {
          method: 'Tarjeta de Crédito',
          details: [
            paymentDetails?.installments
              ? `${paymentDetails.installments.numberOfInstallments} cuota(s) de $${(
                  order.totalAmount / paymentDetails.installments.numberOfInstallments
                ).toFixed(2)}`
              : 'Pago en una cuota',
            paymentDetails?.provider?.name
              ? `Proveedor: ${paymentDetails.provider.name}`
              : null,
            paymentDetails?.bank?.name
              ? `Banco: ${paymentDetails.bank.name}`
              : null
          ].filter(Boolean)
        };
      
      case 'debit_card':
        return {
          method: 'Débito',
          details: ['Pago con tarjeta de débito']
        };
  
      case 'transfer':
        return {
          method: 'Transferencia Bancaria',
          details: [
            'Pago mediante transferencia bancaria',
            'El pedido se procesará al confirmar el pago'
          ]
        };
  
      case 'cash':
        return {
          method: 'Efectivo',
          details: ['Pago en efectivo al retirar']
        };
        
      case 'personal_credit':
        return {
          method: 'Crédito Personal',
          details: [
            'Hemos recibido tu archivo para revisión.',
            'Estamos validando tu información, el pedido se procesará una vez confirmada la aprobación.'
          ]
        };
  
      default:
        return {
          method: 'Método de pago',
          details: ['Método de pago no especificado']
        };
    }
  };
  
  const deliveryInfo = getDeliveryInfo();
  const paymentInfo = getPaymentInfo();

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-500">
            ORDEN: #{order.trackingId}
          </p>
          <p className="text-xs text-gray-400">
            Fecha: {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Payment Status */}
        <div className="border-b pb-6 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-gray-600" />
            {/* Using the new statusTranslations for a cleaner display */}
            <h1 className="text-2xl font-bold">
              {statusTranslations[order.status] || 'Estado desconocido'}
            </h1>
          </div>
          <p className="text-sm text-gray-600">¡Hola {order.client.firstName}!</p>
          <p className="text-sm text-gray-600">¡Muchas gracias por tu compra!</p>
        </div>

        {/* Delivery Information */}
        <div className="flex items-center mb-6">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          <div className="ml-2">
            <h2 className="text-lg font-semibold">{deliveryInfo.title}</h2>
            <p className="text-sm text-gray-600">Dirección: {deliveryInfo.details}</p>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <h3 className="font-semibold mb-4 text-lg text-gray-800 flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-500" />
              <span>Seguimiento del pedido</span>
            </h3>
            <p className="text-gray-600 mb-6">
              Seguí el estado de tu pedido utilizando el número de seguimiento que te enviamos por correo electrónico.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/order-tracking')}
                className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all"
              >
                Seguir pedido
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <h3 className="font-semibold mb-4 text-lg text-gray-800 flex items-center space-x-3">
              <User className="w-5 h-5 text-green-500" />
              <span>Información del pedido</span>
            </h3>
            <div className="space-y-4">
              <div>
                <strong className="text-gray-700">E-MAIL</strong>
                <p className="text-gray-600">{order.client.email}</p>
              </div>
              <div>
                <strong className="text-gray-700">DATOS DE CONTACTO</strong>
                <p className="text-gray-600">
                  {order.client.firstName} {order.client.lastName}
                </p>
                <p className="text-gray-600">{order.client.phone}</p>
              </div>
              <div>
                <strong className="text-gray-700">FORMA DE PAGO</strong>
                <p className="text-gray-600">{paymentInfo.method}</p>
                {paymentInfo.details.map((detail, index) => (
                  <p key={index} className="text-gray-600">{detail}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
          {order.OrderItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-3 border-b hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-24 relative">
                  <Image
                    src={
                      item.Product.Images[0]?.url
                        ? getImageUrl(item.Product.Images[0]?.url)
                        : '/placeholder-product.png'
                    }
                    alt={item.productName}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">{item.productName}</p>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  {item.options && Array.isArray(item.options) && (
                    <div className="text-sm text-gray-500">
                      <p>Opciones:</p>
                      <ul className="list-disc pl-5">
                        {item.options.map((option) => (
                          <li key={option.id}>{option.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 text-sm text-gray-600">
            <div className="flex justify-between border-b pb-2">
              <p>Forma de pago</p>
              <p>{paymentInfo.method}</p>
            </div>
            {order.paymentFormat === 'credit_card' && order.paymentDetails?.installments && (
              <>
                <div className="flex justify-between mt-2">
                  <p>Cantidad de cuotas</p>
                  <p>{order.paymentDetails.installments.numberOfInstallments}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p>Precio por cuota</p>
                  <p>
                    $
                    {(
                      order.totalAmount /
                      order.paymentDetails.installments.numberOfInstallments
                    ).toFixed(2)}
                  </p>
                </div>
              </>
            )}
            <div className="flex justify-between mt-2">
              <p>Envío</p>
              <p className="text-green-600 font-medium">A coordinar</p>
            </div>
          </div>

          <div className="border-t mt-6 pt-4 flex justify-between items-center">
            <p className="font-semibold text-xl text-gray-800">Total</p>
            <p className="font-semibold text-xl text-gray-900">${order.totalAmount}</p>
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
