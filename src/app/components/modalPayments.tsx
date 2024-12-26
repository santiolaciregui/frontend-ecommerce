import React, { useState } from 'react';
import { PAYMENT_FORMATS } from '../constants/checkoutConstants';
import { useCheckout } from '../hooks/useCheckout';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
    const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const {handleOptionChange} = useCheckout();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
            <div className="flex justify-between items-center">
            <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                <i className="fas fa-info-circle"></i>
                Ver formas de pago disponibles
                </button>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Credit/Debit Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <i className="fas fa-credit-card text-blue-500 text-xl"></i>
      <h3 className="font-semibold text-lg">Débito o Crédito</h3>
    </div>
    <ul className="space-y-2 text-sm text-gray-600">
      <li>• Pago seguro con tarjeta</li>
      <li>• Cuotas sin interés disponibles</li>
      <li>• Múltiples bancos aceptados</li>
    </ul>
    <button
      onClick={() => {
        setIsCreditCardModalOpen(true);
        // Set payment format to credit card
        const event = {
          target: {
            name: 'paymentFormat',
            value: PAYMENT_FORMATS.CREDIT_CARD
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleOptionChange(event);
      }}
      className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Ver opciones
    </button>
  </div>

              {/* Cash */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <i className="fas fa-money-bill-wave text-green-500 text-xl"></i>
                  <h3 className="font-semibold text-lg">Efectivo</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pago al retirar el producto</li>
                  <li>• No disponible para envíos</li>
                </ul>
              </div>

              {/* Bank Transfer */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <i className="fas fa-university text-purple-500 text-xl"></i>
                  <h3 className="font-semibold text-lg">Transferencia Bancaria</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Datos bancarios al finalizar</li>
                  <li>• 10% adicional en el precio total</li>
                  <li>• Confirmación inmediata</li>
                </ul>
              </div>

              {/* Personal Credit */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <i className="fas fa-file-invoice-dollar text-orange-500 text-xl"></i>
                  <h3 className="font-semibold text-lg">Crédito Personal</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Requiere documentación</li>
                  <li>• Aprobación en 24-48hs</li>
                  <li>• Cuotas fijas en pesos</li>
                  <li>• Mismo precio que pagando en efectivo</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
       
      </div>
    </>
  );
};

export default PaymentModal;