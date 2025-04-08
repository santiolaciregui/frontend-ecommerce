// useCheckout.ts
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import type { FormData } from '../context/types';
import { Bank, CardProvider, InstallmentOption, Option } from '../context/types';
import { DELIVERY_OPTIONS, PAYMENT_FORMATS, PAYMENT_FORMATS_ES} from '../constants/checkoutConstants';
import { createOrder } from '../pages/api/order';
import { AddressDetails } from '../components/AddressAutocomplete';
import { fetchStores } from '../pages/api/stores';
import apiServiceCards from '../pages/api/promotions';
import paymentFormatsService from '../pages/api/paymentFormat';

export const useCheckout = () => {
  const [personalCreditFile, setPersonalCreditFile] = useState<File | null>(null);
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stores, setStores] = useState([]);
  // Payment related states
  const [providers, setProviders] = useState<CardProvider[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CardProvider | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [installments, setInstallments] = useState<InstallmentOption[]>([]);
  const [totalPrice, setTotalPrice] = useState(() => {
    const basePrice = cart?.reduce((total, item) => total + item.Product.finalPrice * item.quantity, 0) || 0;
    return basePrice;
  });

  const [formData, setFormData] = useState<FormData>({
    contactInfo: { email: '', firstName: '', lastName: '', phone: '' },
    deliveryOption: {
      option: DELIVERY_OPTIONS.PICKUP,
      storeId: 1,
      address: '',
      city: '',
      province: '',
      zip: '',
    },
    paymentFormat: PAYMENT_FORMATS.CREDIT_CARD,
    paymentInstallments: null,
    paymentDetails: {},
    personalCreditFile: null, // Initialize personal credit file as null
  });

  // Estado para la configuración de medios de pago
  const [paymentFormats, setPaymentFormats] = useState<any[]>([]);
  const [paymentFormatsLoading, setPaymentFormatsLoading] = useState(true);

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

  // Obtener paymentFormats desde la API
  useEffect(() => {
    const fetchPaymentFormats = async () => {
      try {
        const data = await paymentFormatsService.fetchPaymentFormats();
        setPaymentFormats(data);
      } catch (err) {
        console.error("Error fetching payment formats:", err);
      } finally {
        setPaymentFormatsLoading(false);
      }
    };
    fetchPaymentFormats();
  }, []);

  // Add this useEffect to update totalPrice when relevant factors change
  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [formData.paymentFormat, formData.paymentInstallments, cart]);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      router.push('/products');
    }
  }, [cart, router]);

  // Fetch providers when payment format is CREDIT_CARD
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

  // Función para calcular el precio total ajustado usando los porcentajes dinámicos
  const calculateTotalPrice = () => {
    let basePrice =
      cart?.reduce((total, item) => total + item.Product.finalPrice * item.quantity, 0) || 0;
    let multiplier = 1;

    switch (formData.paymentFormat) {
      case PAYMENT_FORMATS.PERSONAL_CREDIT: {
        const config = paymentFormats.find(
          (format) => format.paymentMethod === PAYMENT_FORMATS_ES.PERSONAL_CREDIT
        );
        multiplier = config ? 1 + Number(config.percentage) : 1.15;
        break;
      }
      case PAYMENT_FORMATS.TRANSFER: {
        const config = paymentFormats.find(
          (format) => format.paymentMethod === PAYMENT_FORMATS_ES.TRANSFER
        );
        multiplier = config ? 1 + Number(config.percentage) : 2.05;
        break;
      }
      case PAYMENT_FORMATS.DEBIT_CARD: {
        const config = paymentFormats.find(
          (format) => format.paymentMethod === PAYMENT_FORMATS_ES.DEBIT_CARD
        );
        multiplier = config ? 1 + Number(config.percentage) : 1.10;
        break;
      }
      case PAYMENT_FORMATS.CREDIT_CARD: {
        if (formData.paymentInstallments) {
          const interestRate = formData.paymentInstallments.interestRate || 0;
          multiplier = 1 + interestRate / 100;
        }
        break;
      }
      default:
        multiplier = 1;
    }
    return basePrice * multiplier;
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const isPickup = formData.deliveryOption.option === DELIVERY_OPTIONS.PICKUP;
      // Build a FormData instance for file upload support
      const form = new FormData();
      form.append('sessionId', localStorage.getItem('session_id') || '');
      form.append('contactInfo', JSON.stringify(formData.contactInfo));
      if (isPickup) {
        form.append('deliveryOption', JSON.stringify({ option: 'pickup', storeId: formData.deliveryOption.storeId }));
      } else {
        form.append('deliveryOption', JSON.stringify(formData.deliveryOption));
      }
      form.append('paymentFormat', formData.paymentFormat);
      if (formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD) {
        form.append('paymentInstallments', JSON.stringify(formData.paymentInstallments));
      }
      if (formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD || formData.paymentFormat === PAYMENT_FORMATS.DEBIT_CARD) {
        form.append(
          'paymentDetails',
          JSON.stringify({
            provider: formData.paymentDetails?.provider,
            bank: formData.paymentDetails?.bank,
            installments: formData.paymentDetails?.installments,
          })
        );
      }
      form.append('totalAmount', calculateTotalPrice().toFixed(2));
      form.append(
        'cartItems',
        JSON.stringify(
          cart?.map((item) => ({
            product: { id: item.Product.id, name: item.Product.name, price: item.Product.price },
            quantity: item.quantity,
            options: item.Options,
          }))
        )
      );

      // Append file if payment is PERSONAL_CREDIT and file is present
      if (formData.paymentFormat === PAYMENT_FORMATS.PERSONAL_CREDIT && formData.personalCreditFile) {
        form.append('files', formData.personalCreditFile);
      }

      const orderResponse = await createOrder(form);
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
      setFormData((prev) => ({
        ...prev,
        paymentDetails: {
          ...prev.paymentDetails,
          provider: provider,
        },
      }));
    } catch (err) {
      setError('Error fetching banks');
    }
  };

  const handleBankSelect = async (bank: Bank) => {
    setSelectedBank(bank);
    try {
      if (formData.paymentFormat === PAYMENT_FORMATS.CREDIT_CARD) {
        const installmentsData = await apiServiceCards.fetchInstallmentsByBank(bank.id, selectedProvider?.id);
        setInstallments(installmentsData);
      }
      setFormData((prev) => ({
        ...prev,
        paymentDetails: {
          ...prev.paymentDetails,
          bank: bank,
        },
      }));
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
        storeId: selectedStoreId,
      },
    }));
  };

  const handleInstallmentSelect = (installment: InstallmentOption) => {
    setFormData((prev) => ({
      ...prev,
      paymentInstallments: installment,
      paymentDetails: {
        ...prev.paymentDetails,
        installments: installment,
      },
    }));
  
    const basePrice = cart?.reduce(
      (total, item) => total + item.Product.finalPrice * item.quantity,
      0
    );
    
    // Compound the monthly (or per-period) interest
    const interestRate = (installment.interestRate || 0) + 1;
    const finalPriceWithInstallment = basePrice! * interestRate;
    setTotalPrice(finalPriceWithInstallment);
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
  
    const basePrice = cart
      ? cart.reduce((acc, item) => acc + item.Product.finalPrice * item.quantity, 0)
      : 0;
  
    let multiplier = 1;
  
    if (value === PAYMENT_FORMATS.TRANSFER) {
      const config = paymentFormats.find(
        (format) => format.paymentMethod === PAYMENT_FORMATS_ES.TRANSFER
      );
      multiplier = config ? 1 + Number(config.percentage) : 1.05;
    } else if (value === PAYMENT_FORMATS.PERSONAL_CREDIT) {
      const config = paymentFormats.find(
        (format) => format.paymentMethod === PAYMENT_FORMATS_ES.PERSONAL_CREDIT
      );
      multiplier = config ? 1 + Number(config.percentage) : 1.15;
    } else if (value === PAYMENT_FORMATS.DEBIT_CARD) {
      const config = paymentFormats.find(
        (format) => format.paymentMethod === PAYMENT_FORMATS_ES.DEBIT_CARD
      );
      multiplier = config ? 1 + Number(config.percentage) : 1.10;
    } else {
      multiplier = 1;
    }
  
    setTotalPrice(basePrice * multiplier);
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
    const optionsKey =
      item.Options && item.Options.length > 0
        ? `-${item.Options.map((opt: Option) => opt.id).sort().join('-')}`
        : '';
    return `${item.Product.id}${optionsKey}`;
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    success,
    stores,
    cart,
    totalPrice,
    providers,
    banks,
    selectedProvider,
    selectedBank,
    installments,
    calculateTotalPrice,
    handleCheckout,
    handlePaymentSetup,
    handleProviderSelect,
    handleBankSelect,
    handleAddressSelect,
    handleStoreSelect,
    handleInputChange,
    handleOptionChange,
    handleInstallmentSelect,
    handleFileUpload,
    generateUniqueKey,
    setSelectedProvider,
    setSelectedBank,
    setInstallments,
    setBanks,
  };
};
