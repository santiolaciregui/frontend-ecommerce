'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import AddressAutocomplete, { AddressDetails } from './AddressAutocomplete';
import axios from 'axios';
import { CreditCard } from '../context/types';

const Checkout: React.FC = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [paymentOption, setPaymentOption] = useState('credit_card');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [zip, setZip] = useState('');
  const [shippingCost, setShippingCost] = useState(5000); // Default shipping cost
  const { cart, getTotalCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (deliveryOption === 'pickup') {
      setShippingCost(0);
    } else {
      setShippingCost(5000);
    }
  }, [deliveryOption]);

  useEffect(() => {
    const fetchCreditCards = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/credit-cards'); // Reemplaza con la ruta correcta
        setCreditCards(response.data); // Asumiendo que el array de tarjetas está en response.data
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
    setAddress(addressDetails.address);
    setCity(addressDetails.city);
    setProvince(addressDetails.province);
    setZip(addressDetails.zip);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const orderData = {
      email,
      firstName,
      lastName,
      phone,
      shippingAddress: {
        address,
        city,
        province,
        zip,
      },
      deliveryOption,
      paymentOption,
      shippingCost,
      totalAmount: getTotalCart() + shippingCost,
      cartItems: cart.map(item => ({
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
      const response = await axios.post('/api/orders', orderData);
      setSuccess('Order placed successfully!');
      clearCart();
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
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="firstName">Nombre *</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="lastName">Apellido *</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1" htmlFor="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">Detalles de la entrega</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="delivery"
                      checked={deliveryOption === 'delivery'}
                      onChange={() => setDeliveryOption('delivery')}
                      className="mr-2"
                    />
                    Envio a domicilio
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="pickup"
                      checked={deliveryOption === 'pickup'}
                      onChange={() => setDeliveryOption('pickup')}
                      className="mr-2"
                    />
                    Retiro en tienda (Manuel Láinez 267, Q8300 Neuquén)
                  </label>
                </div>

                {deliveryOption === 'delivery' && (
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
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="province">Provincia *</label>
                      <input
                        type="text"
                        id="province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="zip">CP *</label>
                      <input
                        type="text"
                        id="zip"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-4">Forma de pago</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="paymentOption"
                      value="credit_card"
                      checked={paymentOption === 'credit_card'}
                      onChange={() => setPaymentOption('credit_card')}
                      className="mr-2"
                    />
                    Tarjeta
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentOption"
                      value="efectivo"
                      checked={paymentOption === 'efectivo'}
                      onChange={() => setPaymentOption('efectivo')}
                      className="mr-2"
                    />
                    Efectivo en tienda
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentOption"
                      value="personal_credit"
                      checked={paymentOption === 'personal_credit'}
                      onChange={() => setPaymentOption('personal_credit')}
                      className="mr-2"
                    />
                    Credito Personal
                  </label>
                </div>
                {paymentOption === 'credit_card' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1" htmlFor="creditCard">Seleccione su tarjeta *</label>
                      <select
                        id="creditCard"
                        name="creditCard"
                        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        onChange={(e) => console.log('Selected card:', e.target.value)}
                      >
                        <option value="" disabled selected>Seleccione una tarjeta</option>
                        {creditCards.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}


              </div>
            </form>
          </div>

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
            <button onClick={handleCheckout} className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600">Finalizar compra</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
