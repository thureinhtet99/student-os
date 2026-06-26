import { API_BASE_URL } from '@/constants/config';
import { ApiError } from '@/types/api.types';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      try {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'API request failed');
      } catch (e) {
        throw new Error(response.statusText || 'API request failed');
      }
    }
    // Handle cases where response might be empty
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
}
