import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { Bank, CardProvider, FormData, InstallmentOption, Option } from '../context/types';
import { DELIVERY_OPTIONS, PAYMENT_FORMATS } from '../constants/checkoutConstants';
import { createOrder } from '../pages/api/order';
import { AddressDetails } from '../components/AddressAutocomplete';
import { fetchStores } from '../pages/api/stores';
import apiServiceCards from '../pages/api/promotions';

export const useCheckout = () => {
  const [personalCreditFile, setPersonalCreditFile] = useState<File | null>(null);
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState(30000);
  const [stores, setStores] = useState([]);
  const [totalPrice, setTotalPrice] = useState(() =>
    cart?.reduce((total, item) => total + item.Product.finalPrice * item.quantity, 0) || 0
  );

  const [formData, setFormData] = useState<FormData>({
    contactInfo: { email: '', firstName: '', lastName: '' , phone: '' },
    deliveryOption: {
      option: DELIVERY_OPTIONS.PICKUP,
      storeId: 1, // Added storeId here
      address: '',
      city: '',
      province: '',
      zip: '',
    },
    paymentFormat: PAYMENT_FORMATS.CREDIT_CARD,
    paymentInstallments: null,
  });
  

  // Payment related states
  const [providers, setProviders] = useState<CardProvider[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CardProvider| null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [installments, setInstallments] = useState<InstallmentOption[]>([]);
  
  useEffect(() => {
    const loadStores = async () => {
      try {
        const storesData = await fetchStores();
        setStores(storesData);
      } catch (err) {
        setError('Error fetching stores');
      }
    };
    loadStores();
  }, []);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      router.push('/products');
    }
  }, [cart, router]);

  useEffect(() => {
    setShippingCost(formData.deliveryOption.option === DELIVERY_OPTIONS.PICKUP ? 0 : 30000);
  }, [formData.deliveryOption.option]);

  // Add these to your existing useEffect or create a new one
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providersData = await apiServiceCards.fetchProviders();
        console.log('providers: ',providersData)
        setProviders(providersData);
      } catch (err) {
        setError(JSON.stringify(err))
        setError('Error fetching card providers');
      }
    };
    
    if (formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD) {
      fetchProviders();
    }
  }, [formData.paymentFormat]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      const isPickup = formData.deliveryOption.option === DELIVERY_OPTIONS.PICKUP;
  
      const orderData = {
        sessionId: localStorage.getItem('session_id'),
        contactInfo: formData.contactInfo,
        deliveryOption: isPickup
          ? { option: 'pickup', storeId: formData.deliveryOption.storeId } // Include storeId for pickup
          : {
              ...formData.deliveryOption,
              shippingCost,
            },
        paymentFormat: formData.paymentFormat,
        paymentInstallments: formData.paymentInstallments,
        totalAmount: cart
          ? cart
              .reduce((acc, item) => acc + item.Product.finalPrice * item.quantity, 0)
              .toFixed(2)
          : '0.00',
        cartItems: cart
          ? cart.map((item) => ({
              product: { id: item.Product.id, name: item.Product.name, price: item.Product.price },
              quantity: item.quantity,
              options: item.Options,
            }))
          : [],
      };
  
      const orderResponse = await createOrder(orderData);
  
      setSuccess('Order placed successfully!');
      router.push('/success');
      setTimeout(() => {
        router.push(`/order-summary/${orderResponse.id}`);
      }, 5000);
    } catch (err) {
      setError('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handlePaymentSetup = async () => {
    const fetchProviders = async () => {
      try {
        const providersData = await apiServiceCards.fetchProviders();
        setProviders(providersData);
      } catch (err) {
        setError('Error fetching card providers');
      }
    };

    if (formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD) {
      fetchProviders();
    }
  };

  const handleProviderSelect = async (provider: CardProvider) => {
    setSelectedProvider(provider);
    setSelectedBank(null);
    setInstallments([]);
    
    try {
      const banksData = await apiServiceCards.fetchBanksByProvider(provider.id);
      setBanks(banksData);
    } catch (err) {
      setError('Error fetching banks');
    }
  };

  const handleBankSelect = async (bank: Bank) => {
    setSelectedBank(bank);
    try {
      const installmentsData = await apiServiceCards.fetchInstallmentsByBank(bank.id, selectedProvider?.id);
      setInstallments(installmentsData);
    } catch (err) {
      setError('Error fetching installments');
    }
  };

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

  const handleStoreSelect = (selectedStoreId: number) => {
    setFormData((prev) => ({
      ...prev,
      deliveryOption: {
        ...prev.deliveryOption,
        storeId: selectedStoreId, // Update storeId
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

    if (value === PAYMENT_FORMATS.TRANSFER) {
      setTotalPrice(
        cart
          ? cart.reduce((acc, item) => acc + item.Product.finalPrice * item.quantity, 0) * 1.10
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
    const file = e.target.files?.[0] ?? null;
    setPersonalCreditFile(file);
    setFormData((prevData) => ({
      ...prevData,
      personalCreditFile: file,
    }));
  };

  const generateUniqueKey = (item: any) => {
    const optionsKey = item.Options && item.Options.length > 0
      ? `-${item.Options.map((opt: Option) => opt.id).sort().join('-')}`
      : '';
    return `${item.Product.id}${optionsKey}`;
  };

  // Effect for fetching providers when payment format changes
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providersData = await apiServiceCards.fetchProviders();
        setProviders(providersData);
      } catch (err) {
        setError('Error fetching card providers');
      }
    };
    
    if (formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD) {
      fetchProviders();
    }
  }, [formData.paymentFormat]);

  return {
    formData,
    setFormData,
    loading,
    error,
    success,
    stores,
    cart,
    totalPrice,
    shippingCost,
    providers,
    banks,
    selectedProvider,
    selectedBank,
    installments,
    handleCheckout,
    handlePaymentSetup,
    handleProviderSelect,
    handleBankSelect,
    handleAddressSelect,
    handleStoreSelect,
    handleInputChange,
    handleOptionChange,
    handleFileUpload,
    generateUniqueKey,
    setSelectedProvider,
    setSelectedBank,
    setInstallments,
    setBanks,
  };
};