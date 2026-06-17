import { UserGender, UserRole } from '../../../../prisma/generated/prisma/client.js';

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
  classes!: { id: string; name: string }[];
  subjects!: { id: string; name: string }[];
  created_at!: Date;
  updated_at!: Date;
}
