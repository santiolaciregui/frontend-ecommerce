import { useEffect, useState } from 'react';

const useLoadGoogleMaps = (apiKey: string) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      setLoaded(true);
    }
  }, [apiKey]);

  return loaded;
};

export default useLoadGoogleMaps;
