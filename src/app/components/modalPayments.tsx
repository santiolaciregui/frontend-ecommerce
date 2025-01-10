import React from 'react';
import { useCheckout } from '../hooks/useCheckout';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const {
    providers,
    banks,
    selectedBank,
    selectedProvider,
    handleProviderSelect,
    handleBankSelect,
    installments,
    formData,
    setFormData,
  } = useCheckout();

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
              <h2 className="text-xl font-semibold">Seleccionar forma de pago</h2>
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

            {/* Credit Card Section Below All Options */}
            <div className="mt-6 col-span-2 bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Débito o Crédito</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Pago seguro con tarjeta</li>
                <li>• Cuotas sin interés disponibles</li>
                <li>• Múltiples bancos aceptados</li>
              </ul>

              {/* Provider Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Selecciona el proveedor de tu tarjeta
                </label>
                <div className="flex flex-wrap gap-4">
                  {providers.map((provider) => (
                    <label
                      key={provider.id}
                      className="flex items-center cursor-pointer space-x-2"
                    >
                      <input
                        type="radio"
                        name="cardProvider"
                        value={provider.id}
                        checked={selectedProvider?.id === provider.id}
                        onChange={() => handleProviderSelect(provider)}
                      />
                      <img
                        src={`/${provider.name}.png`}
                        alt={provider.name}
                        className="h-8"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Bank Selection */}
              {selectedProvider && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Selecciona el banco
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {banks.map((bank) => (
                      <label
                        key={bank.id}
                        className={`p-4 border rounded-md cursor-pointer ${
                          selectedBank?.id === bank.id ? 'bg-blue-100 border-blue-500' : 'bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="bank"
                          value={bank.id}
                          checked={selectedBank?.id === bank.id}
                          onChange={() => handleBankSelect(bank)}
                          className="mr-2"
                        />
                        <span>{bank.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Installments */}
              {selectedBank && installments.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Selecciona el número de cuotas
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {installments.map((installment) => (
                      <label
                        key={installment.id}
                        className={`p-4 border rounded-md cursor-pointer ${
                          formData.paymentInstallments?.id === installment.id
                            ? 'bg-blue-100 border-blue-500'
                            : 'bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="installments"
                          value={installment.id}
                          checked={formData.paymentInstallments?.id === installment.id}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              paymentInstallments: installment,
                            })
                          }
                          className="mr-2"
                        />
                        <span>{installment.numberOfInstallments} cuotas</span>
                        <span className="text-sm text-gray-500">
                          <br />
                          Interés: {installment.interestRate}%
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
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
