import {
  UserGender,
  UserRole,
} from '../../../../prisma/generated/prisma/client.js';

export class ParentResponseDto {
  id!: string;

  name!: string;

  email!: string;

  phone!: string | null;

  address!: string | null;

  role!: UserRole;

  created_at!: Date;

  updated_at!: Date;
}

export class ClassResponseDto {
  id!: string;

  name!: string;

  created_at!: Date;

  updated_at!: Date;
}

export class GradeResponseDto {
  id!: string;

  level!: number;

  created_at!: Date;

  updated_at!: Date;
}

export class StudentResponseDto {
  id!: string;

  name!: string;

  email!: string;

  phone!: string | null;

  address!: string | null;

  gender!: UserGender;

  birthday!: Date | null;

  image!: string | null;

  role!: UserRole;

  parent!: ParentResponseDto | null;

  class!: ClassResponseDto | null;

  grade!: GradeResponseDto | null;

  created_at!: Date;

  updated_at!: Date;
}
