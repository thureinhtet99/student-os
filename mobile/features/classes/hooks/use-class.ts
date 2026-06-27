import { useState, useEffect } from 'react';
import { getClass, Class } from '@/services/class-service';

export function useClass(id: string) {
  const [classDetail, setClassDetail] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchClass() {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getClass(id);
        setClassDetail(data);
      } catch (error) {
        setIsError(true);
        console.error(`Failed to fetch class with ID ${id}:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchClass();
    }
  }, [id]);

  const refresh = () => {
    if (id) {
        setIsLoading(true);
        setIsError(false);
        getClass(id)
            .then(setClassDetail)
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }
  }

  return { classDetail, isLoading, isError, refresh };
}
