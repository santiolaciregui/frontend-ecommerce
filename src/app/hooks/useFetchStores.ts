import { useState, useEffect } from 'react';
import { fetchStores } from '../pages/api/stores';
import { Store } from '../context/types';

const useFetchStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return { stores, error };
};

export default useFetchStores;
