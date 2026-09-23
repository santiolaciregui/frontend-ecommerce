import { useState, useEffect } from 'react';
import { fetchStores } from '../pages/api/stores';
import { Store } from '../context/types';

const useFetchStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const storesData = await fetchStores();
        setStores(storesData);
      } catch (err) {
        setError('Error fetching stores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  return { stores, error, loading };
};

export default useFetchStores;
