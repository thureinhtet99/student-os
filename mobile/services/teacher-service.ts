import { apiRequest } from './api';
import { PaginatedResponse } from '@/types/api.types';

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  employeeId: string;
  department: string;
  // Add other fields as needed
}

export async function getTeachers(page = 1, limit = 10): Promise<PaginatedResponse<Teacher>> {
  return apiRequest<PaginatedResponse<Teacher>>(`/teachers?page=${page}&limit=${limit}`);
}

export async function getTeacher(id: string): Promise<Teacher> {
  return apiRequest<Teacher>(`/teachers/${id}`);
}
