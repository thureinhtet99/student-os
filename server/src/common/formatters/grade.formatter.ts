import { Grade } from '../../../prisma/generated/prisma/client.js';
import { GradeResponseDto } from '../../modules/grades/dto/grade-response.dto.js';

export function formatGrade(grade: Grade): GradeResponseDto {
  return {
    id: grade.id,
    level: grade.level,
    created_at: grade.createdAt,
    updated_at: grade.updatedAt,
  };
}
