import {
  UserGender,
  UserRole,
} from '../../../../prisma/generated/prisma/client.js';

export class TeacherResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone!: string | null;
  address!: string | null;
  gender!: UserGender;
  birthday!: Date | null;
  image!: string | null;
  role!: UserRole;
  created_at!: Date | null;
  updated_at!: Date | null;
  subjects?: { id: string; name: string }[];
  classes?: { id: string; name: string }[];
}
