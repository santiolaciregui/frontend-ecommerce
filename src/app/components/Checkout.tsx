'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import AddressAutocomplete, { AddressDetails } from './AddressAutocomplete';
import { CreditCard, Option, Store } from '../context/types';
import apiServiceCards from '../pages/api/promotions';
import { createOrder } from '../pages/api/order';
import { fetchStores } from '../pages/api/stores';
import Image from 'next/image';
//import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
//initMercadoPago('APP_USR-c327a30f-bbdf-4864-8f87-a2134da521d5');

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const DELIVERY_OPTIONS = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
};

const PAYMENT_FORMATS = {
  CREDIT_CARD: 'credit_card',
  CASH: 'cash',
  TRANSFER: 'transfer',
  PERSONAL_CREDIT: 'personal_credit',
};

const Checkout: React.FC = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [totalPrice, setTotalPrice] = useState(() =>
    cart?.reduce((total, item) => total + item.Product.finalPrice * item.quantity, 0) || 0
  );
  
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
  const [shippingCost, setShippingCost] = useState(30000); // Default shipping cost
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]); // Example stores
  const [personalCreditFile, setPersonalCreditFile] = useState<File | null>(null); // Add state for the file

  useEffect(() => {
    if (formData.deliveryOption.option === DELIVERY_OPTIONS.PICKUP) {
      setShippingCost(0);
    } else {
      setShippingCost(30000);
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


  const handleStoreSelect = (storeId: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      storeSelection: {
        ...prevFormData.storeSelection,
        store1: storeId, // Update the selected store
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
  
    // Update total price based on payment method
    if (value === PAYMENT_FORMATS.TRANSFER) {
      setTotalPrice(
        cart
          ? cart.reduce((acc, item) => acc + item.Product.finalPrice * item.quantity, 0) * 1.10 // Add 10% increase
          : 0
      );
    } else {
      setTotalPrice(
        cart
          ? cart.reduce((acc, item) => acc + item.Product.finalPrice * item.quantity, 0)
          : 0
      );
    }
  };
  

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null; // Ensure file is either File or null
    setPersonalCreditFile(file); // Update the personal credit file state
    setFormData((prevData) => ({
      ...prevData,
      personalCreditFile: file, // Attach the file to formData
    }));
  };

  const [preferenceId, setPreferenceId] = useState<string | null>(null);


  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const orderData = {
      sessionId: localStorage.getItem("session_id"),
      contactInfo: formData.contactInfo,
      deliveryOption: {
        ...formData.deliveryOption,
        shippingCost,
      },
      paymentFormat: formData.paymentFormat,
      totalAmount: cart ? cart.reduce((acc, item) => acc + item.Product.finalPrice * item.quantity, 0).toFixed(2) : '0.00',
      cartItems: cart ? cart.map((item) => ({
        product: {
          id: item.Product.id,
          name: item.Product.name,
          price: item.Product.price,
        },
        quantity: item.quantity,
        options: item.Options,
      })) : [],
    };

    try {
      // Crear la orden en el backend
      const orderResponse = await createOrder(orderData);

      // Crear la preferencia de pago en Mercado Pago
      //const { preferenceId } = await createPreference(orderData.cartItems, orderData.totalAmount);

      if (orderResponse) {
        setSuccess('Order placed successfully!');
        router.push('/success');
        setTimeout(() => {
          router.push(`/order-summary/${orderResponse.id}`);
        }, 5000);
      }
      
      // Usar el preferenceId para el componente Wallet
      // setPreferenceId(preferenceId);
    } catch (err) {
      setError('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateUniqueKey = (item: any) => {
    const optionsKey = item.Options && item.Options.length > 0
      ? `-${item.Options.map((opt: Option) => opt.id).sort().join('-')}`
      : '';
    return `${item.Product.id}${optionsKey}`;
  };

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
              <hr />
              {/* Delivery Details */}
              <h2 className="text-xl font-semibold mb-4">Detalles de la entrega</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
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
                    <i className="fas fa-truck mr-2"></i>Envio a domicilio
                  </label>
                  <label className="flex items-center">
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
                    <i className="fas fa-store mr-2"></i>Retiro en tienda
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
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Selecciona la tienda donde retirará sus productos
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                      {stores.map((store) => (
                        <div
                          key={store.id}
                          className={`p-4 border rounded-md flex items-center space-x-4 cursor-pointer ${formData.storeSelection.store1 === store.id?.toString() ? 'bg-blue-100 border-blue-500' : 'bg-white'
                            }`}
                          onClick={() => handleStoreSelect(store.id?.toString() || '')}
                        >
                          {/* Font Awesome Icon */}
                          <div className="text-2xl">
                            {formData.storeSelection.store1 === store.id?.toString() ? (
                              <i className="fas fa-check-circle text-blue-500"></i>
                            ) : (
                              <i className="far fa-circle text-gray-500"></i>
                            )}
                          </div>
                          {/* Store Details */}
                          <div>
                            <h4 className="text-sm font-medium">{store.name}</h4>
                            <p className="text-xs text-gray-500">{store.address} - {store.city}, {store.state}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
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
                    <i className="fas fa-credit-card mr-2"></i>  Tarjeta de crédito
                  </label>
                  <label className={`p-4 border rounded-md flex flex-col space-y-2 cursor-pointer ${formData.paymentFormat === PAYMENT_FORMATS.CASH ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="paymentFormat"
                        value={PAYMENT_FORMATS.CASH}
                        checked={formData.paymentFormat === PAYMENT_FORMATS.CASH}
                        onChange={handleOptionChange}
                        className="mr-2"
                      />
                      <i className="fas fa-money-bill-wave mr-2"></i>Efectivo
                    </div>
                  </label>
                  <label
                    className={`p-4 border rounded-md flex flex-col space-y-2 cursor-pointer ${
                      formData.paymentFormat === PAYMENT_FORMATS.TRANSFER
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
                    <span className="text-sm text-gray-500">Requiere cargar un archivo</span>
                  </label>
                </div>
              
                {formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="creditCard">Al finalizar la compra, un vendedor enviará el link de pago</label>
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
                    <label className="block text-sm font-medium mb-1" htmlFor="personalCredit">Por favor, cargue su último recibo de sueldo, esto es necesario para crédito personal</label>
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
                <div className="flex justify-between items-center">
                  <span>Envío</span>
                  <span>${shippingCost}</span>
                </div>
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
            {/* {preferenceId && (
              <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
