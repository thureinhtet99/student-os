import { UserGender } from '../../../prisma/generated/prisma/client';

export function formatGender(gender: string): UserGender {
  return gender.toUpperCase() as UserGender;
}
