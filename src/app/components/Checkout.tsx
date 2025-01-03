'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import ContactForm from './ContactForm';
import DeliveryForm from './DeliveryForm';
import { DELIVERY_OPTIONS, PAYMENT_FORMATS } from '../constants/checkoutConstants';
import { useCheckout } from '../hooks/useCheckout';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Checkout: React.FC = () => {
  const router = useRouter();
  const { cart } = useCart();
  const [shippingCost, setShippingCost] = useState(30000); // Default shipping cost
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { handleCheckout, formData, setFormData, handleProviderSelect, handleBankSelect, handleAddressSelect, handleStoreSelect, handleInputChange, handleOptionChange, handleFileUpload, generateUniqueKey, stores, providers, banks, selectedProvider, selectedBank, installments } = useCheckout();

  const [totalPrice, setTotalPrice] = useState(() =>
    cart?.reduce((total, item) => total + item.Product.finalPrice * item.quantity, 0) || 0
  );

  
// Function to calculate the adjusted total price
const calculateTotalPrice = () => {
  let basePrice = cart?.reduce((total, item) => total + item.Product.finalPrice * item.quantity, 0) || 0;

  if (formData.paymentFormat === PAYMENT_FORMATS.PERSONAL_CREDIT) {
    basePrice *= 1.15; // Add 15% for personal credit
  } else if (formData.paymentFormat === PAYMENT_FORMATS.TRANSFER) {
    basePrice *= 1.10; // Add 10% for transfer
  } else if (formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD && formData.paymentInstallments) {
    // Add interest based on selected installment
    const interestRate = formData.paymentInstallments.interestRate || 0;
    basePrice *= (1 + interestRate / 100);
  }
  return basePrice;
};
useEffect(() => {
  if (formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY && formData.paymentFormat === PAYMENT_FORMATS.CASH) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      paymentFormat: PAYMENT_FORMATS.CREDIT_CARD, // Default to a different payment method
    }));
  }
}, [formData.deliveryOption.option, formData.paymentFormat, setFormData]);

// Recalculate total price when payment format, installments, or cart changes
useEffect(() => {
  const updatedTotal = calculateTotalPrice() + shippingCost;
  setTotalPrice(updatedTotal);
}, [cart, formData.paymentFormat, formData.paymentInstallments, shippingCost]);
  

  // Update shipping cost based on delivery option
  useEffect(() => {
    if (formData.deliveryOption.option === DELIVERY_OPTIONS.PICKUP) {
      setShippingCost(0);
    } else {
      setShippingCost(30000);
    }
  }, [formData.deliveryOption.option]);


  // Redirect to another page if the cart is empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      router.push('/products'); // Redirect to products page or any other page
    }
  }, [cart, router]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Finaliza tu compra</h1>
          <a href="/products" className="text-blue-500 hover:underline">Continuar comprando</a>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form className="space-y-4">
              {/* Contact Details */}
              <ContactForm
                formData={formData}
                handleInputChange={handleInputChange}
              />
              <hr />
              {/* Delivery Details */}
              <DeliveryForm
                formData={formData}
                setFormData={setFormData}
                DELIVERY_OPTIONS={DELIVERY_OPTIONS}
                handleAddressSelect={handleAddressSelect}
                handleStoreSelect={handleStoreSelect}
                stores={stores}
                handleInputChange={handleInputChange}
              />
              <hr />
              {/* Payment Details */}
              <h2 className="text-xl font-semibold mb-4">Forma de pago</h2>
              <p className="text-sm text-gray-500">Seleccione la opción deseada y un vendedor se pondrá en contacto con usted para coordinar el pago</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  <label className={`p-4 border rounded-md flex items-center space-x-4 cursor-pointer ${formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>
                    <input
                      type="radio"
                      name="paymentFormat"
                      value={PAYMENT_FORMATS.CREDIT_CARD}
                      checked={formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD}
                      onChange={handleOptionChange}
                      className="mr-2"
                    />
                    <i className="fas fa-credit-card mr-2"></i>  Débito o Crédito
                  </label>
                  <label
                    className={`p-4 border rounded-md flex flex-col space-y-2 cursor-pointer ${formData.paymentFormat === PAYMENT_FORMATS.CASH ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="paymentFormat"
                        value={PAYMENT_FORMATS.CASH}
                        checked={formData.paymentFormat === PAYMENT_FORMATS.CASH}
                        onChange={handleOptionChange}
                        disabled={formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY} // Disable if Delivery is selected
                        className="mr-2 cursor-pointer disabled:cursor-not-allowed"
                      />
                      {formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY && (
                        <span className="text-xs text-gray-400 ml-2">(No disponible para entrega a domicilio)</span>
                      )}

                      <i className="fas fa-money-bill-wave mr-2"></i> Efectivo
                    </div>
                  </label>

                  <label
                    className={`p-4 border rounded-md flex flex-col space-y-2 cursor-pointer ${formData.paymentFormat === PAYMENT_FORMATS.TRANSFER
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white"
                      }`}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="paymentFormat"
                        value={PAYMENT_FORMATS.TRANSFER}
                        checked={formData.paymentFormat === PAYMENT_FORMATS.TRANSFER}
                        onChange={handleOptionChange}
                        className="mr-2"
                      />
                      <i className="fas fa-university mr-2"></i>
                      Transferencia Bancaria
                    </div>
                    <span className="text-sm text-gray-500">
                      10% adicional en el precio total
                    </span>
                  </label>

                  <label className={`p-4 border rounded-md flex flex-col space-y-2 cursor-pointer ${formData.paymentFormat === PAYMENT_FORMATS.PERSONAL_CREDIT ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="paymentFormat"
                        value={PAYMENT_FORMATS.PERSONAL_CREDIT}
                        checked={formData.paymentFormat === PAYMENT_FORMATS.PERSONAL_CREDIT}
                        onChange={handleOptionChange}
                        className="mr-2"
                      />
                      <i className="fas fa-file-upload mr-2"></i>Crédito Personal
                    </div>
                    <span className="text-sm text-gray-500">
                      15% adicional en el precio total
                    </span>
                    <span className="text-sm text-gray-500">Requiere cargar un archivo</span>
                  </label>
                </div>

                {formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD && (
                  <div className="space-y-4">
                    {/* Provider Selection */}
                    <div>
                    <label>
                      Selecciona el proveedor de tu tarjeta
                    </label>
                    <br />
                    <br />
                    <div>
                      {providers.map((provider) => (
                        <label key={provider.id} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '1rem' }}>
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
                            style={{ marginLeft: '0.1rem', verticalAlign: 'middle', height: '25px' }}
                            />
                        </label>
                      ))}
                    </div>
                  </div>



                    {/* Bank Selection - Only show if provider is selected */}
                    {selectedProvider && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Selecciona el banco
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {banks.map((bank) => (
                            <label
                              key={bank.id}
                              className={`p-4 border rounded-md flex items-center space-x-4 cursor-pointer
                ${selectedBank?.id === bank.id ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}
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

                    {/* Installments Selection - Only show if a bank is selected */}
                    {selectedBank && installments.length > 0 && (
                      <div>
                        <label htmlFor="installments" className="block text-sm font-medium text-gray-700 mb-2">
                          Selecciona el número de cuotas
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {installments.map((installment) => (
                            <label
                              key={installment.id}
                              htmlFor={`installment-${installment.id}`}
                              className={`p-4 border rounded-md flex flex-col space-y-2 cursor-pointer transition 
            ${formData.paymentInstallments?.id === installment.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-300'}`}
                            >
                              <input
                                id={`installment-${installment.id}`}
                                type="radio"
                                name="installments"
                                value={installment.id}
                                checked={formData.paymentInstallments?.id === installment.id}
                                onChange={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    paymentInstallments: installment, // Save the whole object
                                  }))
                                }
                                className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                              />
                              <span className="text-sm text-gray-700">
                                {installment.numberOfInstallments} cuotas de ${(calculateTotalPrice()/installment.numberOfInstallments).toFixed(2)}
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
                )}



                {formData.paymentFormat === PAYMENT_FORMATS.CASH && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="cash">Al finalizar la compra, se coordinará el pago con el vendedor en sucursal</label>
                  </div>
                )}

                {formData.paymentFormat === PAYMENT_FORMATS.TRANSFER && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="transfer">Al finalizar la compra, se contactarán con los datos de la cuenta</label>
                  </div>
                )}

                {formData.paymentFormat === PAYMENT_FORMATS.PERSONAL_CREDIT && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="personalCredit">Es necesario que suba un archivo de su ultimo recibo de sueldo para validarlo</label>
                    <input
                      type="file"
                      id="personalCreditFile"
                      name="personalCreditFile"
                      className="mt-2"
                      onChange={handleFileUpload}
                    />
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
            <div className="border p-4 rounded-md space-y-4">
              {cart?.map((item) => (
                <div className="flex gap-4" key={generateUniqueKey(item)}>
                  <Image
                    src={item.Product.Images[0] ? `${API_URL}${item.Product.Images[0].url}` : '/logo-verde-manzana.svg'}
                    alt={item.Product.name}
                    width={62}
                    height={96}
                    className="object-cover rounded-md"
                  />
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <div className="flex justify-between items-center gap-8">
                        <h3 className="font-semibold">{item.Product.name}</h3>
                        <span className="text-sm text-gray-500">${item.Product.finalPrice.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.Options?.map((option) => (
                          <span key={option.id}>{option.name}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Cantidad:</span>
                        <span className="text-black">{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span>${cart ? cart.reduce((acc, item) => acc + item.Product.finalPrice * item.quantity, 0).toFixed(2) : '0.00'}</span>
                </div>
                {formData.deliveryOption.option !== DELIVERY_OPTIONS.PICKUP && (
                  <div className="flex justify-between items-center gap-8">
                    <span>Envío</span>
                    <p className="text-xs  text-gray-400 mt-2">
                      Se coordinará con el vendedor dependiendo tu zona
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {formData.paymentFormat === PAYMENT_FORMATS.TRANSFER && (
                  <p className="text-sm text-gray-500 mt-2">
                    Incluye un 10% adicional por transferencia bancaria.
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600"
            >
              Finalizar compra
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
