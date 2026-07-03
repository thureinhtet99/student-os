import { ExamResponseDto } from '../../modules/exams/dto/exam-response.dto.js';
import { ExamWithRelations } from '../types/exam.type.js';

export function formatExam(exam: ExamWithRelations): ExamResponseDto {
  return {
    id: exam.id,
    title: exam.title,
    description: exam.description,
    totalMarks: exam.totalMarks as unknown as number,
    passMarks: exam.passMarks as unknown as number,
    startTime: exam.startTime,
    endTime: exam.endTime,
    teachingAssignmentId: exam.teachingAssignmentId,
  };
}
