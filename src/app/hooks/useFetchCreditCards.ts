import { useState, useEffect } from 'react';
import apiServiceCards from '../pages/api/promotions';
import { CreditCard } from '../context/types';

const useFetchCreditCards = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreditCards = async () => {
      setLoading(true);
      try {
        const creditCardsData = await apiServiceCards.fetchCreditCards();
        setCreditCards(creditCardsData);
      } catch (err) {
        setError('Error fetching credit cards');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditCards();
  }, []);

  return { creditCards, loading, error };
};

export default useFetchCreditCards;
