import { ResultResponseDto } from '../../modules/results/dto/result-response.dto.js';
import { ResultWithRelations } from '../types/result.type.js';

export function formatResult(result: ResultWithRelations): ResultResponseDto {
  return {
    id: result.id,
    score: Number(result.score),
    comment: result.comment,
    exam: result.exam ?? null,
    examId: result.examId ?? null,
    academicYearId: result.academicYearId,
    enrollmentId: result.enrollmentId,
  };
}
