import { ResultResponseDto } from '../../modules/results/dto/result-response.dto.js';
import { ResultWithRelations } from '../types/result.type.js';

export function formatResult(result: ResultWithRelations): ResultResponseDto {
  return {
    id: result.id,
    score: result.score,
    comment: result.comment,
    exam: result.exam ? { id: result.exam.id, name: result.exam.name } : null,
    assignment: result.assignment
      ? { id: result.assignment.id, name: result.assignment.name }
      : null,
    student: result.student
      ? { id: result.student.id, name: result.student.name }
      : null,
    created_at: result.createdAt,
    updated_at: result.updatedAt,
  };
}
