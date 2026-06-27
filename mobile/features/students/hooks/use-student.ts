import { useState, useEffect } from 'react';
import { getStudent, Student } from '@/services/student-service';

export function useStudent(id: string) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getStudent(id);
        setStudent(data);
      } catch (error) {
        setIsError(true);
        console.error(`Failed to fetch student with ID ${id}:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchStudent();
    }
  }, [id]);

  const refresh = () => {
    if (id) {
        setIsLoading(true);
        setIsError(false);
        getStudent(id)
            .then(setStudent)
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }
  }

  return { student, isLoading, isError, refresh };
}
