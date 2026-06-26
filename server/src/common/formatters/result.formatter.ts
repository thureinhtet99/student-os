import { ResultResponseDto } from '../../modules/results/dto/result-response.dto.js';
import { ResultWithRelations } from '../types/result.type.js';

export function formatResult(result: ResultWithRelations): ResultResponseDto {
  return {
    id: result.id,
    score: result.score,
    comment: result.comment,
    exam: result.exam ?? null,
    assignment: result.assignment ?? null,
    student: result.student ?? null,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}
