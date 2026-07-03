import { TeachingAssignment } from '../../../../prisma/generated/prisma/client';

export class SubjectResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  teachingAssignments!: TeachingAssignment[];
  // class!: Class | null;
  // teachers!: { id: string; name: string }[];
  createdAt!: Date;
  updatedAt!: Date;
}
