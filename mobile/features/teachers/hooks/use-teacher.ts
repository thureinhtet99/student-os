import { useState, useEffect } from 'react';
import { getTeacher, Teacher } from '@/services/teacher-service';

export function useTeacher(id: string) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchTeacher() {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getTeacher(id);
        setTeacher(data);
      } catch (error) {
        setIsError(true);
        console.error(`Failed to fetch teacher with ID ${id}:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchTeacher();
    }
  }, [id]);

  const refresh = () => {
    if (id) {
        setIsLoading(true);
        setIsError(false);
        getTeacher(id)
            .then(setTeacher)
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }
  }

  return { teacher, isLoading, isError, refresh };
}
