import { useEffect, useState } from 'react';

export const useApi = (loader, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    loader()
      .then((result) => active && setData(result.data))
      .catch((err) => active && setError(err.response?.data?.message || err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, deps);

  return { data, setData, loading, error };
};
