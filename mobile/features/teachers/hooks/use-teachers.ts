import { useState, useEffect } from 'react';
import { getTeachers, Teacher } from '@/services/teacher-service';

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchTeachers(currentPage: number) {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getTeachers(currentPage);
      setTeachers((prevTeachers) => [...prevTeachers, ...response.data]);
      setHasMore(response.meta.page < Math.ceil(response.meta.total / response.meta.limit));
    } catch (error) {
      setIsError(true);
      console.error('Failed to fetch teachers:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setTeachers([]);
    setHasMore(true);
  }

  return { teachers, isLoading, isError, hasMore, loadMore, refresh };
}
