import { useState, useEffect } from 'react';
import { getRecentAnnouncements, Announcement } from '@/services/announcement-service';

export function useRecentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchAnnouncements() {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getRecentAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  return { announcements, isLoading, isError };
}
