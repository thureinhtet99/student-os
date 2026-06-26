import { apiRequest } from './api';
import { PaginatedResponse } from '@/types/api.types';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export async function getRecentAnnouncements(limit = 5): Promise<Announcement[]> {
  try {
    const response = await apiRequest<PaginatedResponse<Announcement>>(
      `/announcements?_sort=createdAt:desc&_limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recent announcements:', error);
    return [];
  }
}
