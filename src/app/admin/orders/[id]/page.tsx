'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import orderService from '../../../pages/api/order';
import { OrdersDetails } from '@/app/context/types';
import BackButton from '@/app/components/BackButton';
import { getImageUrl } from '@/app/utils/getImageURL';

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

  // Translate order status
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

  // Parse payment details and format the info
  const getPaymentInfo = () => {
    const { paymentFormat, paymentDetails } = order;
  
    switch (paymentFormat) {
      case 'credit_card':
        return {
          method: 'Tarjeta de Crédito',
          details: [
            paymentDetails?.installments
              ? `${paymentDetails.installments.numberOfInstallments} cuota(s) ${
                  paymentDetails.installments.interestRate > 0
                    ? `con ${(paymentDetails.installments.interestRate)*100}% de interés`
                    : 'sin interés'
                }`
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

  const paymentInfo = getPaymentInfo();

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md rounded-lg">
        <BackButton destination="/admin/orders" />
        <h1 className="text-3xl font-semibold mb-8 text-center">Detalles de la Orden</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del Pedido */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-bold text-gray-700 border-b pb-2">Información del Pedido</h2>
            <p><strong>Número de Seguimiento:</strong> {order.trackingId}</p>
            <p>
              <strong>Status:</strong>{' '}
              {statusTranslations[order.status] || order.status}
            </p>
            <p><strong>Fecha de Creación:</strong> {formatDate(order.createdAt)}</p>
            <p><strong>Última Actualización:</strong> {formatDate(order.updatedAt)}</p>
            <p><strong>Método de Pago:</strong> {paymentInfo.method}</p>
            {paymentInfo.details.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-600">
                {paymentInfo.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Información del Cliente */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-bold text-gray-700 border-b pb-2">Información del Cliente</h2>
            <p>
              <strong>Nombre:</strong> {order.client?.firstName} {order.client?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {order.client?.email || order.email || 'No disponible'}
            </p>
            <p>
              <strong>Contacto:</strong> {order.client?.phone || 'No disponible'}
            </p>
            <p>
              <strong>Dirección de Envío:</strong> {order.shippingAddress || 'Retiro en tienda'}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Productos en la Orden</h2>
        <div className="border rounded-lg overflow-hidden">
          {order.OrderItems.length === 0 ? (
            <p className="p-4 text-gray-500">No hay productos en esta orden</p>
          ) : (
            <div className="divide-y">
              {order.OrderItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {item.Product?.name || item.productName}
                    </p>
                    {item.Product && item.Product.SKU && (
                      <p className="text-sm text-gray-500">SKU: {item.Product.SKU}</p>
                    )}
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    {item.options &&
                      Array.isArray(item.options) &&
                      item.options.length > 0 && (
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
                  <p className="font-semibold mt-2 md:mt-0">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Summary */}
        <div className="flex justify-end p-4">
          <p className="text-lg font-bold mr-4">Total:</p>
          <p className="text-lg font-bold">{formatCurrency(order.totalAmount)}</p>
        </div>

        {/* Download attached file for Personal Credit */}
        {order.paymentFormat === 'personal_credit' && order.paymentDetails.fileUrl && (
          <div className="mt-8 bg-green-50 p-4 rounded-md border-l-4 border-green-300 flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Archivo adjunto:</span>
            <a
              href={getImageUrl(order.paymentDetails.fileUrl)}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Descargar Archivo
            </a>
          </div>
        )}

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
