'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import ContactForm from './ContactForm';
import DeliveryForm from './DeliveryForm';
import { DELIVERY_OPTIONS, PAYMENT_FORMATS } from '../constants/checkoutConstants';
import { useCheckout } from '../hooks/useCheckout';
import { InstallmentOption } from '../context/types';
import { getImageUrl } from '../utils/getImageURL';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Checkout: React.FC = () => {
  const router = useRouter();
  const { cart } = useCart();

  // Pull everything you need from the useCheckout hook
  const {
    handleCheckout,
    formData,
    setFormData,
    handleProviderSelect,
    handleBankSelect,
    handleAddressSelect,
    handleStoreSelect,
    handleInputChange,
    handleOptionChange,
    handleFileUpload,
    handleInstallmentSelect,
    generateUniqueKey,
    stores,
    providers,
    banks,
    selectedProvider,
    selectedBank,
    installments,
    calculateTotalPrice,
  } = useCheckout();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(() => {
    return cart?.reduce((sum, item) => sum + item.Product.finalPrice * item.quantity, 0) || 0;
  });

  // Helper function to calculate installment display price
  const getInstallmentDisplayPrice = useCallback(
    (installment: InstallmentOption): number => {
      let basePrice =
        cart?.reduce((sum, item) => sum + item.Product.finalPrice * item.quantity, 0) || 0;

      if (formData.deliveryOption.option !== DELIVERY_OPTIONS.PICKUP) {
        basePrice;
      }

      const interestRate = installment.interestRate || 0;
      basePrice *= 1 + interestRate / 100;

      return basePrice;
    },
    [cart, formData.deliveryOption.option]
  );

  // Force a different payment option if user selects Delivery + Cash
  useEffect(() => {
    if (
      formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY &&
      formData.paymentFormat === PAYMENT_FORMATS.CASH
    ) {
      setFormData((prev) => ({
        ...prev,
        paymentFormat: PAYMENT_FORMATS.CREDIT_CARD,
      }));
    }
  }, [formData.deliveryOption.option, formData.paymentFormat, setFormData]);

  // Recalculate total price when payment or cart changes
  useEffect(() => {
    const updatedTotal = calculateTotalPrice() ;
    setTotalPrice(updatedTotal);
  }, [
    cart,
    formData.paymentFormat,
    formData.paymentInstallments,
    calculateTotalPrice,
  ]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      router.push('/products');
    }
  }, [cart, router]);

  // ---- Validation: Check if all required fields are completed ----
  const isCheckoutEnabled = (() => {
    // Validate Contact Info
    const { email, firstName, lastName, phone } = formData.contactInfo;
    if (!email || !firstName || !lastName || !phone) return false;

    // Validate Delivery Option
    if (formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY) {
      const { address, city, province, zip } = formData.deliveryOption;
      if (!address || !city || !province || !zip) return false;
    } else {
      // For pickup, ensure a store is selected (default is set to 1)
      if (!formData.deliveryOption.storeId) return false;
    }

    // Validate Payment Details
    if (
      formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD ||
      formData.paymentFormat === PAYMENT_FORMATS.DEBIT_CARD
    ) {
      if (!formData.paymentDetails?.provider || !formData.paymentDetails?.bank) return false;
      // For credit cards, ensure an installment is selected
      if (formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD && !formData.paymentInstallments)
        return false;
    }

    return true;
  })();
  // ---------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Finaliza tu compra</h1>
          <a href="/products" className="text-blue-500 hover:underline">
            Continuar comprando
          </a>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM SECTION */}
          <div className="lg:col-span-2">
            <form className="space-y-4">
              {/* Contact Details */}
              <ContactForm formData={formData} handleInputChange={handleInputChange} />
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
              <p className="text-sm text-gray-500">
                Seleccione la opción deseada y un vendedor se pondrá en contacto con usted para
                coordinar el pago
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  {/* Payment Option: Tarjeta de Crédito */}
                  <label
                    className={`p-4 border rounded-md flex items-center cursor-pointer ${
                      formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentFormat"
                      value={PAYMENT_FORMATS.CREDIT_CARD}
                      checked={formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD}
                      onChange={handleOptionChange}
                      className="mr-3"
                    />
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-credit-card"></i>
                      <span>Tarjeta de Crédito</span>
                    </div>
                  </label>
                  {/* Payment Option: Tarjeta de Débito */}
                  <label
                    className={`p-4 border rounded-md flex items-center cursor-pointer ${
                      formData.paymentFormat === PAYMENT_FORMATS.DEBIT_CARD
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentFormat"
                      value={PAYMENT_FORMATS.DEBIT_CARD}
                      checked={formData.paymentFormat === PAYMENT_FORMATS.DEBIT_CARD}
                      onChange={handleOptionChange}
                      className="mr-3"
                    />
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-credit-card"></i>
                      <span>Tarjeta de Débito</span>
                    </div>
                  </label>
                  {/* Payment Option: Efectivo */}
                  <label
                    className={`p-4 border rounded-md flex items-center cursor-pointer ${
                      formData.paymentFormat === PAYMENT_FORMATS.CASH
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentFormat"
                      value={PAYMENT_FORMATS.CASH}
                      checked={formData.paymentFormat === PAYMENT_FORMATS.CASH}
                      onChange={handleOptionChange}
                      disabled={formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY}
                      className="mr-3 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex items-center space-x-3">
                      {formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY && (
                        <span className="text-xs text-gray-400">
                          (No disponible para entrega a domicilio)
                        </span>
                      )}
                      <i className="fas fa-money-bill-wave"></i>
                      <span>Efectivo</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY
                        ? ''
                        : 'Aprovecha nuestro precio promocional'}
                    </span>
                  </label>
                  {/* Payment Option: Transferencia */}
                  <label
                    className={`p-4 border rounded-md flex items-center cursor-pointer ${
                      formData.paymentFormat === PAYMENT_FORMATS.TRANSFER
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentFormat"
                      value={PAYMENT_FORMATS.TRANSFER}
                      checked={formData.paymentFormat === PAYMENT_FORMATS.TRANSFER}
                      onChange={handleOptionChange}
                      className="mr-3"
                    />
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-university"></i>
                      <span>Transferencia </span>
                    </div>
                  </label>
                  {/* Payment Option: Crédito Personal */}
                  <label
                    className={`p-4 border rounded-md flex items-center cursor-pointer ${
                      formData.paymentFormat === PAYMENT_FORMATS.PERSONAL_CREDIT
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentFormat"
                      value={PAYMENT_FORMATS.PERSONAL_CREDIT}
                      checked={formData.paymentFormat === PAYMENT_FORMATS.PERSONAL_CREDIT}
                      onChange={handleOptionChange}
                      className="mr-3"
                    />
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-upload"></i>
                      <span>Crédito Personal</span>
                    </div>
                  </label>
                </div>

                {/* Payment details for Credit/Debit Cards */}
                {(formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD ||
                  formData.paymentFormat === PAYMENT_FORMATS.DEBIT_CARD) && (
                  <div className="space-y-4">
                    {/* Provider Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Selecciona el proveedor de tu tarjeta
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {providers.map((provider) => (
                          <label key={provider.id} className="inline-flex items-center">
                            <input
                              type="radio"
                              name="cardProvider"
                              value={provider.id}
                              checked={selectedProvider?.id === provider.id}
                              onChange={() => handleProviderSelect(provider)}
                              className="mr-2"
                            />
                            {/* Example of provider logos: adapt to your naming or route */}
                            <img
                              src={`/${provider.name}.png`}
                              alt={provider.name}
                              className="h-6"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Bank Selection */}
                    {selectedProvider && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Selecciona el banco
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {banks.map((bank) => (
                            <label
                              key={bank.id}
                              className={`p-4 border rounded-md flex items-center space-x-4 cursor-pointer ${
                                selectedBank?.id === bank.id
                                  ? 'bg-blue-100 border-blue-500'
                                  : 'bg-white'
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

                    {/* 
                      ADAPTED: Installments Selection for Credit Cards
                      -------------------------------------------------
                      Shows interest rate, total with interest, and monthly cost
                    */}
                    {selectedBank &&
                      formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD &&
                      installments.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Selecciona el número de cuotas
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {installments.map((installment) => {
                              // Calculate total with interest:
                              const displayTotal = getInstallmentDisplayPrice(installment);
                              // Monthly payment:
                              const monthlyCost = (displayTotal / installment.numberOfInstallments).toFixed(2);

                              return (
                                <label
                                  key={installment.id}
                                  onClick={() => handleInstallmentSelect(installment)}
                                  className={`p-4 border rounded-md flex flex-col space-y-2 cursor-pointer ${
                                    formData.paymentInstallments?.id === installment.id
                                      ? 'bg-blue-100 border-blue-500'
                                      : 'bg-white'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <input
                                      type="radio"
                                      name="installments"
                                      value={installment.id}
                                      checked={formData.paymentInstallments?.id === installment.id}
                                      onChange={() => handleInstallmentSelect(installment)}
                                      className="mr-2 cursor-pointer"
                                    />
                                    <span className="">
                                      {installment.numberOfInstallments} cuotas de ${monthlyCost}
                                    </span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {formData.paymentFormat === PAYMENT_FORMATS.CASH && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="cash">
                      Al finalizar la compra, se coordinará el pago con el vendedor en sucursal
                    </label>
                  </div>
                )}

                {formData.paymentFormat === PAYMENT_FORMATS.TRANSFER && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="transfer">
                      Al finalizar la compra, se contactarán con los datos de la cuenta
                    </label>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* ORDER SUMMARY SECTION */}
          <div 
            className="
              lg:col-span-1 
              lg:sticky
              lg:top-8
              self-start
            "
          >
            <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
            <div className="border p-4 rounded-md space-y-4">
              {cart?.map((item) => (
                <div className="flex gap-4" key={generateUniqueKey(item)}>
                  <Image
                    src={
                      item.Product.Images[0]
                        ? getImageUrl(item.Product.Images[0]?.url)
                        : '/logo-verde-manzana.svg'
                    }
                    alt={item.Product.name}
                    width={62}
                    height={96}
                    className="object-cover rounded-md"
                  />
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <div className="flex justify-between items-center gap-8">
                        <h3 className="font-semibold">{item.Product.name}</h3>
                        <span className="text-sm text-gray-500">
                          ${item.Product.finalPrice.toFixed(2)}
                        </span>
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
                  <span>
                    $
                    {cart
                      ? cart
                          .reduce(
                            (acc, item) => acc + item.Product.finalPrice * item.quantity,
                            0
                          )
                          .toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                {formData.deliveryOption.option !== DELIVERY_OPTIONS.PICKUP && (
                  <div className="flex flex-col gap-1 mt-2">
                    <span>Envío</span>
                    <p className="text-xs text-gray-400">
                      Se coordinará con el vendedor dependiendo tu zona
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center font-semibold mt-2">
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
              disabled={loading || !isCheckoutEnabled}
              className={`w-full p-2 mt-4 rounded-md ${
                loading || !isCheckoutEnabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Realizar el pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
