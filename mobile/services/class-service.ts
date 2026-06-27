import { apiRequest } from './api';
import { PaginatedResponse } from '@/types/api.types';

export interface Class {
  id: string;
  name: string;
  year: number;
  teacherId?: string;
  // Add other fields as needed
}

export async function getClasses(page = 1, limit = 10): Promise<PaginatedResponse<Class>> {
  return apiRequest<PaginatedResponse<Class>>(`/classes?page=${page}&limit=${limit}`);
}

export async function getClass(id: string): Promise<Class> {
  return apiRequest<Class>(`/classes/${id}`);
}
