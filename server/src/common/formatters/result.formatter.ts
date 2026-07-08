import { Result } from '../../../prisma/generated/prisma/client.js';
import { ResultResponseDto } from '../../modules/results/dto/result-response.dto.js';

export function formatResult(result: Result): ResultResponseDto {
  return {
    id: result.id,
    score: result.score?.toNumber() ?? null,
    comment: result.comment,
    examId: result.examId,
    academicYearId: result.academicYearId,
    enrollmentId: result.enrollmentId,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}
