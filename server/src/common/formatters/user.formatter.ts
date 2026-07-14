import { UserGender } from '../../../prisma/generated/prisma/client';

export function formatGender(gender: UserGender): UserGender {
  return gender.toUpperCase() as UserGender;
}
