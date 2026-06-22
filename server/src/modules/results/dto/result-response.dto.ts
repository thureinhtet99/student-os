import {
  Assignment,
  Exam,
  Student,
} from '../../../../prisma/generated/prisma/client';

export class ResultResponseDto {
  id!: string;
  score!: number;
  comment!: string | null;
  exam!: Exam | null;
  assignment!: Assignment | null;
  student!: Omit<Student, 'password'> | null;
  createdAt!: Date;
  updatedAt!: Date;
}
