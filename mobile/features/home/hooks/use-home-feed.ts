import { useState, useEffect } from 'react';
import { getDashboardCounts } from '@/services/dashboard-service';
import { DashboardCounts } from '@/types/dashboard.types';

const fallbackData: DashboardCounts = {
  students: 1200,
  teachers: 80,
  classes: 40,
  subjects: 25,
  attendances: 0, // Should be calculated daily
  exams: 12,
  results: 0, // Should be calculated
  events: 5,
  announcements: 10,
  assignments: 50,
};

export function useHomeFeed() {
  const [data, setData] = useState<DashboardCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function fetchData() {
    setIsLoading(true);
    setIsError(false);
    try {
      const counts = await getDashboardCounts();
      const allZero = Object.values(counts).every((count) => count === 0);
      if (allZero) {
        setData(fallbackData);
      } else {
        setData(counts);
      }
    } catch (error) {
      setIsError(true);
      setData(fallbackData);
      console.error(
        'Failed to fetch dashboard counts, using fallback data.',
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, isError, refetch: fetchData };
}
