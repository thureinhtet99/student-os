import { ExamResponseDto } from '../../modules/exams/dto/exam-response.dto.js';
import { ExamWithRelations } from '../types/exam.type.js';

export function formatExam(exam: ExamWithRelations): ExamResponseDto {
  return {
    id: exam.id,
    name: exam.name,
    description: exam.description,
    startTime: exam.startTime,
    endTime: exam.endTime,
    subject: exam.subject
      ? { id: exam.subject.id, name: exam.subject.name }
      : null,
    created_at: exam.createdAt,
    updated_at: exam.updatedAt,
  };
}
