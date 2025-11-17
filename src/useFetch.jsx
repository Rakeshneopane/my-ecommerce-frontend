// src/hooks/useFetch.js
import { useState, useEffect } from "react";

export const useFetch = (url, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        setData(json);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [url]);

  return { data, loading, error };
};
