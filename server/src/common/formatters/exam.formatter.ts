import { Exam } from '../../../prisma/generated/prisma/client.js';
import { ExamResponseDto } from '../../modules/exams/dto/exam-response.dto.js';

export function formatExam(exam: Exam): ExamResponseDto {
  return {
    id: exam.id,
    title: exam.title,
    description: exam.description,
    totalMarks: exam.totalMarks.toNumber(),
    passMarks: exam.passMarks.toNumber(),
    startTime: exam.startTime,
    endTime: exam.endTime,
    teachingAllocationId: exam.teachingAllocationId,
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
  };
}
