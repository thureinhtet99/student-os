import { UserResponseDto } from '../../../common/dto/user-response.dto.js';

export class GradeResponseDto {
  id!: string;

  level!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export class StudentResponseDto extends UserResponseDto {
  studentId!: string;

  parent!: { id: string; name: string } | null;

  class!: { id: string; name: string } | null;

  grade!: { id: string; level: number } | null;
}
