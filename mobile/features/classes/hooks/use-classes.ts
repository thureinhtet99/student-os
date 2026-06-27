import { useState, useEffect } from 'react';
import { getClasses, Class } from '@/services/class-service';

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchClasses(currentPage: number) {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getClasses(currentPage);
      setClasses((prevClasses) => [...prevClasses, ...response.data]);
      setHasMore(response.meta.page < Math.ceil(response.meta.total / response.meta.limit));
    } catch (error) {
      setIsError(true);
      console.error('Failed to fetch classes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClasses(page);
  }, [page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setClasses([]);
    setHasMore(true);
  }

  return { classes, isLoading, isError, hasMore, loadMore, refresh };
}
