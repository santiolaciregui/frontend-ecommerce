// hooks/useCreditCardPayment.ts
'use client';
import { useState, useEffect } from 'react';
import apiServiceCards from '../pages/api/promotions';

export interface CardProvider {
  id: number;
  name: string;
  // any other provider fields
}

export interface Bank {
  id: number;
  name: string;
  // any other bank fields
}

export interface InstallmentOption {
  id: number;
  numberOfInstallments: number;
  interestRate?: number;
  // any other installment fields
}

export const useCreditCardPayment = () => {
  const [providers, setProviders] = useState<CardProvider[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CardProvider | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [installments, setInstallments] = useState<InstallmentOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch the available card providers on mount
  useEffect(() => {
    apiServiceCards.fetchProviders()
      .then(data => setProviders(data))
      .catch(() => setError('Error fetching providers'));
  }, []);

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
      if (selectedProvider) {
        const installmentsData = await apiServiceCards.fetchInstallmentsByBank(bank.id, selectedProvider.id);
        setInstallments(installmentsData);
      }
    } catch (err) {
    }
  };

  return {
    providers,
    banks,
    selectedProvider,
    selectedBank,
    installments,
    handleProviderSelect,
    handleBankSelect,
    error,
  };
};
