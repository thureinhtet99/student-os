import { apiRequest } from './api';
import { PaginatedResponse } from '@/types/api.types';
import { DashboardCounts } from '@/types/dashboard.types';

async function getCount(endpoint: string): Promise<number> {
  try {
    const response = await apiRequest<PaginatedResponse<unknown>>(
      `/${endpoint}?limit=1`
    );
    return response.meta.total;
  } catch (error) {
    console.error(`Failed to fetch count for ${endpoint}:`, error);
    return 0;
  }
}

export const getDashboardCounts = async (): Promise<DashboardCounts> => {
  const countPromises = {
    students: getCount('students'),
    teachers: getCount('teachers'),
    classes: getCount('classes'),
    subjects: getCount('subjects'),
    attendances: getCount('attendances'),
    exams: getCount('exams'),
    results: getCount('results'),
    events: getCount('events'),
    announcements: getCount('announcements'),
    assignments: getCount('assignments'),
  };

  const counts = await Promise.all(Object.values(countPromises));
  const keys = Object.keys(countPromises);

  return keys.reduce((acc, key, index) => {
    return { ...acc, [key]: counts[index] };
  }, {} as DashboardCounts);
};
