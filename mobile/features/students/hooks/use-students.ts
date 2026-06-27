import { useState, useEffect } from 'react';
import { getStudents, Student } from '@/services/student-service';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchStudents(currentPage: number) {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getStudents(currentPage);
      setStudents((prevStudents) => [...prevStudents, ...response.data]);
      setHasMore(response.meta.page < Math.ceil(response.meta.total / response.meta.limit));
    } catch (error) {
      setIsError(true);
      console.error('Failed to fetch students:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setStudents([]);
    setHasMore(true);
  }

  return { students, isLoading, isError, hasMore, loadMore, refresh };
}
