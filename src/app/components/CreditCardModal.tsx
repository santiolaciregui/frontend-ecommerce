import React, { useState } from 'react';
import { PAYMENT_FORMATS } from '../constants/checkoutConstants';

interface Provider {
  id: string;
  name: string;
}

interface Bank {
  id: string;
  name: string;
}

interface Installment {
  id: string;
  numberOfInstallments: number;
  interestRate: number;
  totalInterestRate: number;
}

interface CreditCardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  handleOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProviderSelect: (provider: Provider) => void;
  handleBankSelect: (bank: Bank) => void;
  providers: Provider[];
  banks: Bank[];
  selectedProvider: Provider | null;
  selectedBank: Bank | null;
  installments: Installment[];
  setFormData: (formData: any) => void;
}

const CreditCardDetailsModal: React.FC<CreditCardDetailsModalProps> = ({
  isOpen,
  onClose,
  formData,
  handleOptionChange,
  handleProviderSelect,
  handleBankSelect,
  providers,
  banks,
  selectedProvider,
  selectedBank,
  installments,
  setFormData
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Detalles de Tarjeta
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona el proveedor de la tarjeta
            </label>
            <div>
              {providers.map((provider) => (
                <label
                  key={provider.id}
                  className="inline-flex items-center mr-4"
                >
                  <input
                    type="radio"
                    name="cardProvider"
                    value={provider.id}
                    checked={selectedProvider?.id === provider.id}
                    onChange={() => handleProviderSelect(provider)}
                    className="mr-2"
                  />
                  <img
                    src={`/${provider.name}.png`}
                    alt={provider.name}
                    className="ml-1 h-6"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Bank Selection */}
          {selectedProvider && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona el banco
              </label>
              <div className="grid grid-cols-2 gap-4">
                {banks.map((bank) => (
                  <label
                    key={bank.id}
                    className={`p-4 border rounded-md flex items-center cursor-pointer ${selectedBank?.id === bank.id ? 'bg-blue-50 border-blue-500' : 'border-gray-200 hover:border-blue-200'}`}
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

          {/* Installments Selection */}
          {selectedBank && installments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona el número de cuotas
              </label>
              <div className="grid grid-cols-2 gap-4">
                {installments.map((installment) => (
                  <label
                    key={installment.id}
                    className={`p-4 border rounded-md flex flex-col space-y-2 cursor-pointer ${formData.paymentInstallments?.id === installment.id ? 'bg-blue-50 border-blue-500' : 'border-gray-200 hover:border-blue-200'}`}
                  >
                    <input
                      type="radio"
                      name="installments"
                      value={installment.id}
                      checked={formData.paymentInstallments?.id === installment.id}
                      onChange={() => setFormData({ ...formData, paymentInstallments: installment })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">
                      {installment.numberOfInstallments} cuotas
                    </span>
                    <span className="text-xs text-gray-500">
                      Tasa de interés: {installment.interestRate}%
                    </span>
                   
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (selectedProvider && selectedBank && formData.paymentInstallments) {
                  onClose();
                }
              }}
              disabled={!selectedProvider || !selectedBank || !formData.paymentInstallments}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardDetailsModal;
