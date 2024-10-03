'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import AddressAutocomplete, { AddressDetails } from './AddressAutocomplete';
import { CreditCard, Store } from '../context/types';
import apiServiceCards from '../pages/api/promotions';
import { createOrder, createPreference } from '../pages/api/order';
import { fetchStores } from '../pages/api/stores';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

initMercadoPago('APP_USR-c327a30f-bbdf-4864-8f87-a2134da521d5');



const DELIVERY_OPTIONS = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
};

const PAYMENT_FORMATS = {
  CREDIT_CARD: 'credit_card',
  CASH: 'cash',
  TRANSFER: 'transfer',
};

const Checkout: React.FC = () => {
  const router = useRouter();
  const { cart, getTotalCart, clearCart } = useCart();
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [formData, setFormData] = useState({
    contactInfo: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
    deliveryOption: {
      option: DELIVERY_OPTIONS.PICKUP,
      address: '',
      city: '',
      province: '',
      zip: '',
    },
    paymentFormat: PAYMENT_FORMATS.CREDIT_CARD,
    storeSelection: {
      store1: 'LAINEZ 123',
    },
  });
  const [shippingCost, setShippingCost] = useState(5000); // Default shipping cost
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]); // Example stores

  useEffect(() => {
    if (formData.deliveryOption.option === DELIVERY_OPTIONS.PICKUP) {
      setShippingCost(0);
    } else {
      setShippingCost(5000);
    }
  }, [formData.deliveryOption.option]);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const storesData = await fetchStores();
        setStores(storesData);
      } catch (err) {
        setError('Error fetching stores');
        console.error(err);
      }
    };
    loadStores();
  }, []);


  useEffect(() => {
    const fetchCreditCards = async () => {
      setLoading(true);
      try {
        const creditCards = await apiServiceCards.fetchCreditCards();
        setCreditCards(creditCards);
      } catch (err) {
        setError('Error fetching credit cards');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditCards();
  }, []);

  

  const handleAddressSelect = (addressDetails: AddressDetails) => {
    setFormData((prevData) => ({
      ...prevData,
      deliveryOption: {
        ...prevData.deliveryOption,
        address: addressDetails.address,
        city: addressDetails.city,
        province: addressDetails.province,
        zip: addressDetails.zip,
      },
    }));
  };


  const handleStoreSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      storeSelection: {
        ...prevData.storeSelection,
        [name]: value,
      },
    }));
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (['email', 'firstName', 'lastName', 'phone'].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        contactInfo: {
          ...prevData.contactInfo,
          [name]: value,
        },
      }));
    } else if (['address', 'city', 'province', 'zip'].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        deliveryOption: {
          ...prevData.deliveryOption,
          [name]: value,
        },
      }));
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const [preferenceId, setPreferenceId] = useState<string | null>(null);





  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const orderData = {
      contactInfo: formData.contactInfo,
      deliveryOption: {
        ...formData.deliveryOption,
        shippingCost,
      },
      paymentFormat: formData.paymentFormat,
      totalAmount: getTotalCart() + shippingCost,
      cartItems: cart.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        },
        quantity: item.quantity,
        options: item.options,
      })),
    };

    try {
      // Crear la orden en el backend
      const orderResponse = await createOrder(orderData);

      // Crear la preferencia de pago en Mercado Pago
      const { preferenceId } = await createPreference(orderData.cartItems, orderData.totalAmount);

      setSuccess('Order placed successfully!');
      clearCart();
//      router.push('/success');

      // Usar el preferenceId para el componente Wallet
      setPreferenceId(preferenceId);
    } catch (err) {
      setError('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-xl font-semibold mb-4">Datos de contacto</h2>
            <form className="space-y-4">
              {/* Contact Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="firstName">Nombre *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.contactInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="lastName">Apellido *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.contactInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1" htmlFor="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Delivery Details */}
              <h2 className="text-xl font-semibold mb-4">Detalles de la entrega</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value={DELIVERY_OPTIONS.DELIVERY}
                      checked={formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          deliveryOption: {
                            ...prevData.deliveryOption,
                            option: e.target.value,
                          },
                        }))
                      }
                      className="mr-2"
                    />
                    Envio a domicilio
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value={DELIVERY_OPTIONS.PICKUP}
                      checked={formData.deliveryOption.option === DELIVERY_OPTIONS.PICKUP}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          deliveryOption: {
                            ...prevData.deliveryOption,
                            option: e.target.value,
                          },
                        }))
                      }
                      className="mr-2"
                    />
                    Retiro en tienda 
                  </label>
                </div>

                {formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1" htmlFor="address">Dirección *</label>
                      <AddressAutocomplete onSelect={handleAddressSelect} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="city">Ciudad *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.deliveryOption.city}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="province">Provincia *</label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        value={formData.deliveryOption.province}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="zip">CP *</label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={formData.deliveryOption.zip}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {formData.deliveryOption.option === DELIVERY_OPTIONS.PICKUP && (
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Selecciona la tienda donde retirará sus productos</label>
                  <select
                    name="store1"
                    value={formData.storeSelection.store1}
                    onChange={handleStoreSelect}
                    className="w-full border p-2 rounded-md"
                  >
                    <option value="">Selecciona una tienda</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                  </div>
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <h2 className="text-xl font-semibold mb-4">Forma de pago</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="paymentFormat"
                      value={PAYMENT_FORMATS.CREDIT_CARD}
                      checked={formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD}
                      onChange={handleOptionChange}
                      className="mr-2"
                    />
                    Tarjeta de crédito
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentFormat"
                      value={PAYMENT_FORMATS.CASH}
                      checked={formData.paymentFormat === PAYMENT_FORMATS.CASH}
                      onChange={handleOptionChange}
                      className="mr-2"
                    />
                    Efectivo
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentFormat"
                      value={PAYMENT_FORMATS.TRANSFER}
                      checked={formData.paymentFormat === PAYMENT_FORMATS.TRANSFER}
                      onChange={handleOptionChange}
                      className="mr-2"
                    />
                    Transferencia
                  </label>
                </div>

                {formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="creditCard">Al finalizar la compra, se realizará el pago a través de Mercado Pago</label>
                  </div>
                )}

                {formData.paymentFormat === PAYMENT_FORMATS.CASH && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="cash">Se coordinará el pago con el vendedor</label>
                  </div>
                )}

                {formData.paymentFormat === PAYMENT_FORMATS.TRANSFER && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="transfer">CBU: 4554676911100027723062 - Nro Cuenta: 1110003967000 - BPN</label>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
            <div className="border p-4 rounded-md space-y-4">
              {cart.map((cartItem) => (
                <div key={cartItem.product.id} className="flex justify-between items-center">
                  <div>
                    <span>{cartItem.product.name}</span>
                    <span className="text-gray-500 ml-2">x {cartItem.quantity}</span>
                  </div>
                  <span>${cartItem.product.price! * cartItem.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span>${getTotalCart()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Envío</span>
                  <span>${shippingCost}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>${getTotalCart() + shippingCost}</span>
                </div>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600">
              Finalizar compra
            </button>
            {preferenceId && (
              <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
