import {
  Class,
  Grade,
  Parent,
} from '../../../../prisma/generated/prisma/client.js';
import { UserResponseDto } from '../../../common/dto/user-response.dto.js';

export class GradeResponseDto {
  id!: string;

  level!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export class StudentResponseDto extends UserResponseDto {
  studentId!: string;

  parent!: Parent | null;

  class!: Class | null;

  grade!: Grade | null;
}
