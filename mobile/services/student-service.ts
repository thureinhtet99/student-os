import { apiRequest } from './api';
import { PaginatedResponse } from '@/types/api.types';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  studentId: string;
  grade: string;
  class: string; // or className
  // Add other fields as needed
}

export async function getStudents(page = 1, limit = 10): Promise<PaginatedResponse<Student>> {
  return apiRequest<PaginatedResponse<Student>>(`/students?page=${page}&limit=${limit}`);
}

export async function getStudent(id: string): Promise<Student> {
  return apiRequest<Student>(`/students/${id}`);
}
