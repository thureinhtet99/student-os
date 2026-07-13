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

export type StudentGender = 'MALE' | 'FEMALE' | 'OTHER';
export type StudentRole = 'STUDENT';

export interface CreateStudentPayload {
  name: string;
  email: string;
  password: string;
  gender: StudentGender;
  academicYearId: string;
  role?: StudentRole;
  phone?: string;
  address?: string;
  dateOfBirth?: string; // ISO date string
  image?: string;
  parentId?: string;
  classId?: string;
}

export async function getStudents(page = 1, limit = 10): Promise<PaginatedResponse<Student>> {
  return apiRequest<PaginatedResponse<Student>>(`/students?page=${page}&limit=${limit}`);
}

export async function getStudent(id: string): Promise<Student> {
  return apiRequest<Student>(`/students/${id}`);
}

export async function createStudent(payload: CreateStudentPayload): Promise<Student> {
  return apiRequest<Student>('/students', {
    method: 'POST',
    body: payload,
  });
}
