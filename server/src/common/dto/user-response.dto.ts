import { UserGender } from '../../../prisma/generated/prisma/client';

export class UserResponseDto {
  id!: string;

  userId!: string;

  name!: string;

  email!: string;

  phone!: string | null;

  address!: string | null;

  gender!: UserGender;

  role!: string;

  dateOfBirth!: Date | null;

  image!: string | null;

  createdAt!: Date;

  updatedAt!: Date;
}
